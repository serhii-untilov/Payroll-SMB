module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin', 'no-loops', 'prettier'],
    env: { node: true, jest: true },
    ignorePatterns: ['dist', '.eslintrc.js', 'babel.config.js', 'webpack.config.js'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['tests/**/*'],
            plugins: ['jest'],
            env: {
                'jest/globals': true,
            },
        },
    ],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'warn',
        // 'no-loops/no-loops': 'warn',
        'prettier/prettier': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        'max-len': [
            'error',
            {
                code: 120,
                ignoreTemplateLiterals: true,
                ignoreStrings: true,
                ignoreUrls: true,
            },
        ],
    },
};
