module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'no-loops', 'prettier'],
    env: { browser: true, es2020: true },
    ignorePatterns: ['dist', '.eslintrc.cjs', 'timeout.js'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // 'no-console': 'warn',
        'no-loops/no-loops': 'warn',
        'prettier/prettier': 'warn',
    },
};
