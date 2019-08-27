import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const libraryName = 'mlz_axios'

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        'axios': 'axios'
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      globals: {
        'axios': 'axios'
      },
    }
  ],
  external: ['axios'],
  watch: {
    inclue: 'src/**'
  },
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true
    }),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
}