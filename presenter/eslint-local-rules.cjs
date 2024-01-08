/* eslint import/no-commonjs: 0 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utils = require('./node_modules/eslint-plugin-vue/lib/utils')

function getName(attribute) {
  if (!attribute.directive) {
    return attribute.key.name
  }
  if (attribute.key.name.name === 'bind') {
    return (
      (attribute.key.argument &&
        attribute.key.argument.type === 'VIdentifier' &&
        attribute.key.argument.name) ||
      null
    )
  }
  return null
}

function getValue(attribute) {
  return attribute.value.value
}

module.exports = {
  'href-pattern': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce href attribute values to start with "/" or "https://" in .vue files',
      },
      fixable: null,
      schema: [],
      context: ['vue'],
      messages: {
        invalidHrefValue:
          'Invalid href value: "{{hrefValue}}". In this project href values must start with "/" or "https://".',
      },
    },
    create(context) {
      return utils.defineTemplateBodyVisitor(context, {
        VStartTag() {},
        VAttribute(node) {
          const name = getName(node)
          if (name == null) {
            return
          }

          if (name === 'href') {
            const hrefValue = getValue(node)

            if (
              hrefValue !== undefined &&
              hrefValue.charAt(0) !== '/' &&
              hrefValue.charAt(0) !== 'https://'
            ) {
              context.report({
                node,
                loc: node.loc,
                messageId: 'invalidHrefValue',
                data: { hrefValue },
              })
            }
          }
        },
      })
    },
  },
}
