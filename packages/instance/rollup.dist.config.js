import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'withInstances.mjs',
  output: [
    {
      file: 'dist/withInstances.mjs',
      format: 'es',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/withInstances.min.mjs',
      format: 'es',
      sourcemap: true,
      compact: true,
      exports: 'named',
      plugins: [terser()]
    }
  ],
  plugins: [
    commonjs()
  ]
},
// CJS and LEGACY CJS
{
  input: 'withInstances.cjs',
  output: [
    {
      file: 'dist/withInstances.es5.js',
      format: 'es',
      exports: 'named',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/withInstances.es5.min.js',
      format: 'es',
      exports: 'named',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    },
    {
      file: 'dist/withInstances.cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/withInstances.min.cjs',
      format: 'cjs',
      exports: 'named',
      plugins: [terser()],
      sourcemap: true,
      compact: true
    }
  ]
},
// IIFE OUTPUT
{
  input: 'withInstances.cjs',
  output: [{
    file: 'dist/withInstances.iife.js',
    format: 'iife',
    exports: 'named',
    name: 'withInstances',
    sourcemap: true
  }, {
    file: 'dist/withInstances.iife.min.js',
    format: 'iife',
    exports: 'named',
    name: 'withInstances',
    sourcemap: true,
    compact: true,
    plugins: [terser()]
  }],
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}]
