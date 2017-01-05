/**
 * @fileoverview Prevent direct usage of this.state or this.props inside this.setState
 * @author Huy Nguyen
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent direct usage of "this.state" or "this.props" inside "this.setState"',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        checkState: {
          default: true,
          type: 'boolean'
        },
        checkProps: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {

    var configuration = context.options[0] || {};
    var checkState = configuration.checkState || true;
    var checkProps = configuration.checkProps || false;

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

      MemberExpression: function(node) {
        if (!node.object || node.object.type !== 'ThisExpression') {
          return;
        }

        if (
          (!checkState || node.property.name !== 'state') &&
          (!checkProps || node.property.name !== 'props')
        ) {
          return;
        }

        var ancestors = context.getAncestors(node).reverse();
        for (var i = 0, j = ancestors.length; i < j; i++) {
          var callee = ancestors[i].callee;
          if (
            !callee ||
            !callee.object ||
            callee.object.type !== 'ThisExpression' ||
            callee.property.name !== 'setState'
          ) {
            continue;
          }

          // Only check objects or function calls passed to setState() as first parameter
          if (
            /(Object|Call)Expression$/.test(ancestors[i].arguments[0].type) &&
            ancestors[i].arguments[0] === ancestors[i - 1]
          ) {
            context.report({
              node: callee,
              message: 'Unexpected usage of "this.' + node.property.name + '" in "setState". Use callback instead'
            });
          }

          break;

        }
      }
    };

  }
};
