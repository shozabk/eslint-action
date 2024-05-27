/**
 * Default ESLint rules.
 * @author Abdul Rehman
 */
export const eslintRules = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'no-plusplus': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    // eslint-disable-next-line quote-props
    eqeqeq: 'error',
    // eslint-disable-next-line quote-props
    camelcase: 'error',
  },
};
