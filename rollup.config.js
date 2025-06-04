import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/core.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
      { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: 'src/react.tsx',
    output: [{ file: 'dist/react.esm.js', format: 'esm', sourcemap: true }],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: ['react'],
  },
  {
    input: 'src/plugins/image.ts',
    output: [
      { file: 'dist/plugins/image.esm.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: 'src/plugins/table.ts',
    output: [
      { file: 'dist/plugins/table.esm.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: 'src/types.ts',
    output: [{ file: 'dist/types.d.ts', format: 'esm' }],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        outDir: 'dist',
      }),
    ],
  },
];
