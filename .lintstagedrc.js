module.exports = {
  // Для Vue файлов
  "*.vue": ["eslint --fix", "prettier --write"],

  // Для JavaScript файлов
  "*.{js,jsx}": ["eslint --fix", "prettier --write"],

  // Для TypeScript файлов (исключаем .d.ts)
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],

  // Для JSON, YAML, Markdown и других конфигурационных файлов
  "*.{json,yaml,yml,md,html,css,scss}": ["prettier --write"],

  // Исключаем .d.ts файлы из проверки ESLint
  "!*.d.ts": ["eslint --fix"],

  // Если есть TypeScript - проверка типов (исключаем .d.ts)
  "*.{ts,tsx,vue}": [() => "vue-tsc --noEmit --exclude **/*.d.ts"].filter(
    () => process.env.CI !== "true",
  ),
};
