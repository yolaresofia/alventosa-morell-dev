const next = require('eslint-config-next/core-web-vitals');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...next,
  {
    ignores: ['sanity.types.ts'],
  },
];
