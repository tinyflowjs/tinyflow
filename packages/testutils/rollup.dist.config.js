import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'utils.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.min.js',
      format: 'es',
      sourcemap: true,
      compact: true,
      plugins: [terser()]
    },
    {
      file: 'dist/index.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/index.es5.min.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.min.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    }
  ],
  plugins: [commonjs(), nodeResolve()]
},
// IIFE OUTPUT
{
  input: 'utils.js',
  output: [{
    file: 'dist/index.iife.js',
    format: 'iife',
    name: 'index',
    sourcemap: true
  }, {
    file: 'dist/index.iife.min.js',
    format: 'iife',
    name: 'index',
    sourcemap: true,
    compact: true,
    plugins: [terser()]
  }],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}]
