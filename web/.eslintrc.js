module.exports = {
  extends: ['react-app', 'plugin:jsx-a11y/recommended', 'plugin:vitest/recommended'],
  rules: {
    'react/prop-types': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute > JSXExpressionContainer > Literal[raw.0="\'"]',
        message:
          'Avoid wrapping string literal props into braces. Bad: foo={\'bar\'}, good: foo="bar").',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['lodash', 'lodash/*', 'lodash.*'],
            message: 'Use lodash-es instead.',
          },
        ],
      },
    ],
    'react/function-component-definition': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
  },
  overrides: [
    {
      files: '*.stories.{js,jsx}',
      rules: {
        'import/no-anonymous-default-export': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['*.test.{js,jsx}', 'src/tools/**/*.{js,jsx}', './setup-test.js'],
      env: {
        'vitest/env': true,
      },
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
