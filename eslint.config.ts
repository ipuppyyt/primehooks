import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    { ignores: ['dist/', 'scripts/', '.github/', 'docs/', 'web/', '**/node_modules/'] },
    {
        files: ['src/hooks**/*.{ts}'],
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        ignores: ['dist'],
    }
);