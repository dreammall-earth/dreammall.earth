/* eslint import/no-commonjs: 0 */
import utils from './node_modules/eslint-plugin-vue/lib/utils'

import type { Rule } from 'eslint'

function getName(attribute: any) {
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

function getValue(attribute: any ) {
  return attribute.value.value
}

export default {
  'href-pattern': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce href attribute values to start with "/" or "https://" in .vue files',
      },
      fixable: undefined,
      schema: [],
      messages: {
        invalidHrefValue:
          'Invalid href value: "{{hrefValue}}". In this project href values must start with "/" or "https://".',
      },
    },
    create(context) {
      return utils.defineTemplateBodyVisitor(context, {
        VStartTag() {},
        VAttribute(node: any) {
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
} satisfies Record<string, Rule.RuleModule>
