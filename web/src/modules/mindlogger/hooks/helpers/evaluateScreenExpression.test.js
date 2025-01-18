import { evaluateScreenExpression } from './evaluateScreenExpression';
import { visibilityFixtures } from './fixture';

let activity, items, firstItem, secondItem, thirdItem, fourthItem, fiveItem, sixItem, sevenItem;

beforeEach(() => {
  activity = visibilityFixtures.defaultActivityWithExpressions();

  items = activity.items;
  firstItem = items[0];
  secondItem = items[1];
  thirdItem = items[2];
  fourthItem = items[3];
  fiveItem = items[4];
  sixItem = items[5];
  sevenItem = items[6];
});

it('evaluates visibility without any responses', () => {
  let responses = [];

  expect(evaluateScreenExpression(firstItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(secondItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(thirdItem.visibility, items, responses)).toBe(false);
  expect(evaluateScreenExpression(fourthItem.visibility, items, responses)).toBe(false);
  expect(evaluateScreenExpression(fiveItem.visibility, items, responses)).toBe(false);
  expect(evaluateScreenExpression(sixItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(sevenItem.visibility, items, responses)).toBe(true);
});

it('evaluates visibility without one response provided', () => {
  let responses = [null, 1];

  expect(evaluateScreenExpression(firstItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(secondItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(thirdItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(fourthItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(fiveItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(sixItem.visibility, items, responses)).toBe(true);
  expect(evaluateScreenExpression(sevenItem.visibility, items, responses)).toBe(true);
});
