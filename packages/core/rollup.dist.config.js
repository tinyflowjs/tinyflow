import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'Tinyflow.js',
  output: [
    {
      file: 'dist/Tinyflow.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/Tinyflow.min.js',
      format: 'es',
      sourcemap: true,
      compact: true,
      plugins: [terser()]
    },
    {
      file: 'dist/Tinyflow.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/Tinyflow.es5.min.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    },
    {
      file: 'dist/Tinyflow.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/Tinyflow.cjs.min.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] }), terser()],
      sourcemap: true,
      compact: true
    }
  ]
},
  // IIFE OUTPUT
  {
    input: 'Tinyflow.js',
    output: [{
      file: 'dist/Tinyflow.iife.js',
      format: 'iife',
      name: 'Tinyflow',
      sourcemap: true,
    }, {
      file: 'dist/Tinyflow.iife.min.js',
      format: 'iife',
      name: 'Tinyflow',
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
