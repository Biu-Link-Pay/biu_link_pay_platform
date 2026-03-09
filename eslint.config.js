import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    ignores: [
      'DEPLOYMENT_CHECK_REPORT.md',
      'scripts/**',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': 'off',
      'no-debugger': 'warn',
      'ts/no-use-before-define': 'off',
      // 逐步迁移，暂放宽部分规则
      'style/max-statements-per-line': 'off',
      'e18e/prefer-static-regex': 'off',
      'unicorn/prefer-number-properties': 'off',
    },
  },
  {
    files: ['**/PersonalCenter.vue'],
    rules: {
      'unused-imports/no-unused-vars': ['error', { varsIgnorePattern: '^(navigateTo|_confirm)' }],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'vue/no-export-in-script-setup': 'off',
    },
  },
)
