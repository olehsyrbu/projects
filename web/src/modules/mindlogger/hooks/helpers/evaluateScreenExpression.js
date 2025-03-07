import { Parser } from 'expr-eval';

export function evaluateScreenExpression(
  testExpression = true,
  items = [],
  responses = [],
  responseTimes = {},
) {
  // Short circuit for common testExpression
  if (testExpression === true || testExpression === 'true') {
    return true;
  }

  const parser = new Parser({
    logical: true,
    comparison: true,
  });

  let testExpressionFixed = testExpression
    .replace(/&&/g, ' and ')
    .replace(/\|\|/g, ' or ')
    .replace('===', '==')
    .replace('!==', '!=')
    .replace(/(\w+\.)/g, 'arrayIncludes($&')
    .replace(/.includes\(/g, ', ')
    .replace(/\!(?!=)/g, 'not ');

  // Custom function to test if element is present in array

  const isActivityShownFirstTime = (activity) => !responseTimes[activity];

  const arrayIncludes = (array, element) => {
    if (array === undefined || array === null) {
      return false;
    }
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === element) {
        return true;
      }
    }
    return false;
  };

  parser.functions.arrayIncludes = arrayIncludes;
  parser.functions.isActivityShownFirstTime = isActivityShownFirstTime;

  try {
    const expr = parser.parse(testExpressionFixed);
    // Build an object where the keys are item variableNames, and values are
    // item responses
    const inputs = items.reduce((acc, item, index) => {
      const response =
        responses[index] && (responses[index].value || responses[index].value === 0)
          ? responses[index].value
          : responses[index];

      return {
        ...acc,
        [item.variableName]: responses[index] === 0 ? 0 : response === 0 ? 0 : response || null, // cast undefined to null
      };
    }, {});

    // Run the expression
    const result = expr.evaluate(inputs);
    return !!result; // Cast the result to true or false
  } catch (error) {
    return true; // Default to true if we can't parse the expression
  }
}
