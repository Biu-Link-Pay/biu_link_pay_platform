import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // 禁用自动换行
      'max-len': 'off',
      'prettier/prettier': 'off',
      // 其他规则
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser
      }
    }
  }
)
