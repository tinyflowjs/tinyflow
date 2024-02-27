import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'withInstances.js',
  output: [
    {
      file: 'dist/withInstances.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/withInstances.min.js',
      format: 'es',
      sourcemap: true,
      compact: true,
      plugins: [terser()]
    },
    {
      file: 'dist/withInstances.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/withInstances.es5.min.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    },
    {
      file: 'dist/withInstances.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/withInstances.cjs.min.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    }
  ]
},
// IIFE OUTPUT
{
  input: 'withInstances.js',
  output: [{
    file: 'dist/withInstances.iife.js',
    format: 'iife',
    name: 'withInstances',
    sourcemap: true
  }, {
    file: 'dist/withInstances.iife.min.js',
    format: 'iife',
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
