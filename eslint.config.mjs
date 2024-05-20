import eslint from '@eslint/js';
import teslint from 'typescript-eslint';

export default teslint.config(eslint.configs.recommended, {
  ignores: ['dist', 'tests', 'node_modules', 'jest.config.js'],
});
