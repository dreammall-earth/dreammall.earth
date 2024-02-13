import tsNode from 'ts-node'

let defaultExport

const loadRules = async () => {
  tsNode.register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  })

  const rulesModule = await import('./rules')
  defaultExport = rulesModule.default
}

loadRules()
export default defaultExport
