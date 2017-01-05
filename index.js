/* eslint-disable global-require */

'use strict';

var allRules = {
  'prefer-callback-set-state': require('./lib/rules/prefer-callback-set-state')
}

module.exports = {
  rules: allRules ,
  configs: {
    recommended: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'cloudability/prefer-callback-set-state': 'error',
      }
    }
  }
};
