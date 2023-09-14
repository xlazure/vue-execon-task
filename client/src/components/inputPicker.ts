const context: Record<string, any> = import.meta.globEager('./inputs/*.vue')
/**/

const inputsModules = Object.keys(context).map((key) => key.replace(/^\.\/inputs\/(.*).vue$/, '$1'))

export const getDynamicComponent = (componentName: string) => {
  const matchingModule = inputsModules.find(
    (moduleName) => moduleName.toLowerCase() === componentName.toLowerCase()
  )
  if (matchingModule) {
    const component = context[`./inputs/${matchingModule}.vue`].default
    return (
      component || {
        template: '<div>Component not found</div>'
      }
    )
  }

  return {
    template: '<div>Component not found</div>'
  }
}
