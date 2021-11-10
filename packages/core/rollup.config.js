import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

let externals = [];
if (pkg.peerDependencies) {
  externals = Object.keys(pkg.peerDependencies);
}

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/index.js',
    },
    {
      format: 'es',
      file: 'dist/index.esm.js',
    },
    {
      format: 'iife',
      file: 'dist/index.iife.js',
    },
    {
      format: 'cjs',
      file: 'dist/index.min.js',
      plugins: [terser()],
    },
    {
      format: 'es',
      file: 'dist/index.esm.min.js',
      plugins: [terser()],
    },
    {
      format: 'iife',
      file: 'dist/index.iife.min.js',
      plugins: [terser()],
    },
  ],
  external: [...externals],
  plugins: [
    resolve({
      mainFields: ['module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
  ],
};
