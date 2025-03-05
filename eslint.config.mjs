import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
const config = [
    {
        rules: {
            'no-restricted-globals': [
                'error',
                { name: 'self', message: 'Use self cautiously' },
            ],
        },
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: {
            globals: {
                webkitAudioContext: 'readonly',
                ...globals.browser, // Ensures browser globals (e.g., `window`, `document`)
                self: true, // Adds `self`
                globalThis: true, // Adds `globalThis`
                FinalizationRegistry: true, // Adds `FinalizationRegistry`
            },
            ecmaVersion: 'latest', // Ensures latest JS features
        },
    },
    {
        env: {
            browser: true, // Ensures browser-specific APIs are recognized
            es2020: true,
            node: true,
        },
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
];

/** @type {import('eslint').Linter.Config[]} */
export default config;
