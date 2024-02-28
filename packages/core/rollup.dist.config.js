import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'Tinyflow.mjs',
  output: [
    {
      file: 'dist/Tinyflow.mjs',
      format: 'es',
      exports: 'named'
    },
    {
      file: 'dist/Tinyflow.min.mjs',
      format: 'es',
      exports: 'named',
      sourcemap: true,
      compact: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    commonjs()
  ]
},

// CJS / LEGACY CJS
{
  input: 'Tinyflow.cjs',
  output: [
    {
      file: 'dist/Tinyflow.es5.js',
      format: 'es',
      exports: 'named',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/Tinyflow.es5.min.js',
      format: 'es',
      exports: 'named',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    },
    {
      file: 'dist/Tinyflow.cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/Tinyflow.min.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      compact: true
    }
  ]
},
// IIFE + UMD OUTPUT
{
  input: 'Tinyflow.cjs',
  output: [{
    file: 'dist/Tinyflow.iife.js',
    format: 'iife',
    name: 'Tinyflow',
    exports: 'named',
    sourcemap: true
  }, {
    file: 'dist/Tinyflow.iife.min.js',
    format: 'iife',
    name: 'Tinyflow',
    sourcemap: true,
    compact: true,
    exports: 'named',
    plugins: [terser()]
  }, {
    file: 'dist/Tinyflow.umd.js',
    format: 'umd',
    name: 'Tinyflow',
    exports: 'named',
    sourcemap: true
  }, {
    file: 'dist/Tinyflow.umd.min.js',
    format: 'umd',
    name: 'Tinyflow',
    sourcemap: true,
    compact: true,
    exports: 'named',
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
