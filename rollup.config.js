import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
      input: 'source/core.ts',
      output: [
        { file: 'dist/index.cjs.js', format: 'cjs' },
        { file: 'dist/index.esm.js', format: 'esm' }
      ],
      plugins: [nodeResolve(), commonjs(),
      typescript()],
    },
    {
      input: 'src/react.tsx',
      output: [{ file: 'dist/react.esm.js', format: 'esm' }],
      plugins: [nodeResolve(), commonjs(), typescript()],
      external: ['react'],
    },
    {
      input: 'src/plugins/image.ts',
      output: [{ file: 'dist/plugins/image.esm.js', format: 'esm' }],
      plugins: [nodeResolve(), commonjs(), typescript()],
    },
    {
      input: 'src/plugins/table.ts',
      output: [{ file: 'dist/plugins/table.esm.js', format: 'esm' }],
      plugins: [nodeResolve(), commonjs(), typescript()],
    },
    {
      input: 'src/types.ts',
      output: [{ file: 'dist/types.d.ts', format: 'esm' }],
      plugins: [typescript({ declaration: true, outDir: 'dist' })],
    },
  ];