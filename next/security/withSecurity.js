/**
 * Provides a configurable way to seal/freeze/remove internals.
 * By default
 * @param config {object=}
 */
export const withSecurity = (config= {}) => (internal, external) => {
  const { seal, freeze, remove } = config
  const allInternal = Object.values(internal)
  const allExternal = Object.values(external)

  // sealing
  
  // freezing

  // removal, only scoped for Tinyflow methods

}