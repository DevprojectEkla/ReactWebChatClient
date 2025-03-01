// .eslintrc.mjs
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default {
  root: true, // This ensures ESLint applies the config only in the current project and doesn't traverse parent directories
  parser: 'babel-eslint', // This allows ESLint to parse modern JavaScript features
  extends: [
    'eslint:recommended', // ESLint's recommended rules
    'plugin:react/recommended', // React-specific linting rules
    'plugin:react-hooks/recommended', // React hooks linting rules
    'plugin:prettier/recommended', // Prettier integration (this ensures Prettier rules are enforced)
  ],
  plugins: ['react', 'react-hooks', 'prettier'], // Enable the necessary plugins
  parserOptions: {
    ecmaVersion: 2021, // Allows modern JavaScript syntax (e.g., async/await, import/export)
    sourceType: 'module', // Allows using ES module syntax (import/export)
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing for React
    },
  },
  rules: {
    'prettier/prettier': ['error'], // Enforces Prettier formatting
    'react/prop-types': 'off', // Disable PropTypes rule (if you're using TypeScript, you don't need this)
    'react/jsx-uses-react': 'off', // React 17 JSX transform doesn't require this
    'react/react-in-jsx-scope': 'off', // React 17 JSX transform doesn't require this
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], // Allows JSX in JS and TS files
    'react-hooks/rules-of-hooks': 'error', // Enforces rules for hooks
    'react-hooks/exhaustive-deps': 'warn', // Warns when dependencies are missing in hooks (e.g., useEffect)
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Warns about console.log, but allows console.warn and console.error
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warns about unused variables except for ones starting with _
    'no-debugger': 'warn', // Warns about debugger statements
    'eqeqeq': ['error', 'always'], // Enforces strict equality (=== instead of ==)
    'curly': ['error', 'all'], // Enforces the use of curly braces in control statements
    'default-case': 'error', // Enforces default case in switch statements
    'consistent-return': 'error', // Enforces consistent return behavior in functions
    'no-magic-numbers': ['warn', { ignore: [0, 1] }], // Avoid magic numbers, but allows 0 and 1
    'no-empty-function': 'warn', // Warns about empty functions
    'prefer-const': 'error', // Enforces use of `const` for variables that are never reassigned
    'no-var': 'error', // Enforces the use of `let` or `const` instead of `var`
    'arrow-spacing': ['error', { before: true, after: true }], // Enforces spacing around arrow function arrows
    'object-curly-spacing': ['error', 'always'], // Enforces spacing inside curly braces
    'comma-dangle': ['error', 'always-multiline'], // Enforces trailing commas in multi-line objects and arrays
    'no-trailing-spaces': 'error', // Enforces no trailing spaces at the end of lines
    'max-len': ['error', { code: 80 }], // Enforces a maximum line length (80 characters by default)
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
