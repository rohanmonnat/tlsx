import eslint from '@eslint/js';
import teslint from 'typescript-eslint';

export default teslint.config(
  eslint.configs.recommended,
  ...teslint.configs.strict,
  ...teslint.configs.stylistic,
  {
    ignores: ['dist', 'tests', 'node_modules'],
  }
);
