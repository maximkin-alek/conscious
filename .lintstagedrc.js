module.exports = {
  // Для Vue файлов
  "*.vue": ["eslint --fix", "prettier --write"],

  // Для JavaScript файлов
  "*.{js,jsx}": ["eslint --fix", "prettier --write"],

  // Для JSON, YAML, Markdown и других конфигурационных файлов
  "*.{json,yaml,yml,md,html,css,scss}": ["prettier --write"],
};
