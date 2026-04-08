#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Конфигурация
const PROJECT_ROOT = process.cwd();
const RULES_FILE = path.join(PROJECT_ROOT, '.cursorrules');
const REPORT_FILE = path.join(PROJECT_ROOT, 'AI_REVIEW.md');

// Чтение правил проекта
function readProjectRules() {
  try {
    return fs.readFileSync(RULES_FILE, 'utf-8');
  } catch (error) {
    console.error('❌ Не удалось прочитать файл .cursorrules:', error.message);
    return '';
  }
}

// Получение измененных Vue компонентов
function getChangedVueFiles() {
  try {
    // Получаем список измененных файлов между текущей веткой и основной
    const mainBranch = 'main'; // или 'master' в зависимости от проекта
    
    // Пробуем получить изменения относительно origin/main
    let diffCommand;
    try {
      diffCommand = `git diff --name-only origin/${mainBranch}...HEAD`;
      execSync(diffCommand, { stdio: 'pipe' });
    } catch {
      // Если нет origin/main, используем локальную ветку
      diffCommand = `git diff --name-only ${mainBranch}...HEAD`;
    }
    
    const changedFiles = execSync(diffCommand, { encoding: 'utf-8' })
      .split('\n')
      .filter(file => file.trim() && file.endsWith('.vue'))
      .map(file => path.join(PROJECT_ROOT, file));
    
    return changedFiles;
  } catch (error) {
    console.error('❌ Ошибка при получении измененных файлов:', error.message);
    return [];
  }
}

// Анализ Vue компонента
function analyzeVueComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  
  const issues = [];
  const warnings = [];
  const recommendations = [];
  
  // Проверка на использование Options API
  if (content.includes('export default {') && 
      (content.includes('data()') || content.includes('methods:') || content.includes('computed:'))) {
    issues.push({
      type: 'error',
      message: 'Используется Options API вместо Composition API',
      rule: 'NEVER использовать Options API в новых компонентах',
      suggestion: 'Переписать на Composition API с <script setup>'
    });
  }
  
  // Проверка на использование Vuex $store
  if (content.includes('$store') && !content.includes('pinia')) {
    warnings.push({
      type: 'warning',
      message: 'Используется Vuex $store вместо Pinia',
      rule: 'NEVER использовать $store в новых компонентах',
      suggestion: 'Заменить на useStore() из Pinia'
    });
  }
  
  // Проверка на inline-стили
  const styleRegex = /style="[^"]*"/g;
  const inlineStyles = content.match(styleRegex);
  if (inlineStyles && inlineStyles.length > 0) {
    warnings.push({
      type: 'warning',
      message: `Найдено ${inlineStyles.length} inline-стилей`,
      rule: 'NEVER создавать inline-стили',
      suggestion: 'Использовать классы Vuetify или scoped CSS'
    });
  }
  
  // Проверка структуры компонента
  const scriptSetupMatch = content.match(/<script\s+setup>/);
  if (!scriptSetupMatch && content.includes('<script>')) {
    recommendations.push({
      type: 'recommendation',
      message: 'Компонент не использует <script setup>',
      suggestion: 'Мигрировать на <script setup> для лучшей производительности'
    });
  }
  
  // Проверка на использование Vuetify классов
  const hasVuetifyClasses = content.includes('class="') && 
    (content.includes('pa-') || content.includes('ma-') || content.includes('text-'));
  if (!hasVuetifyClasses && content.includes('class="')) {
    recommendations.push({
      type: 'recommendation',
      message: 'Возможно не используются утилитные классы Vuetify',
      suggestion: 'Использовать утилиты Vuetify для отступов и типографики'
    });
  }
  
  return {
    file: relativePath,
    issues,
    warnings,
    recommendations,
    stats: {
      lines: content.split('\n').length,
      issuesCount: issues.length,
      warningsCount: warnings.length,
      recommendationsCount: recommendations.length
    }
  };
}

// Генерация отчета в Markdown
function generateReport(analysisResults) {
  const timestamp = new Date().toLocaleString('ru-RU');
  const totalFiles = analysisResults.length;
  const totalIssues = analysisResults.reduce((sum, r) => sum + r.stats.issuesCount, 0);
  const totalWarnings = analysisResults.reduce((sum, r) => sum + r.stats.warningsCount, 0);
  const totalRecommendations = analysisResults.reduce((sum, r) => sum + r.stats.recommendationsCount, 0);
  
  let report = `# AI Review Report\n\n`;
  report += `**Дата:** ${timestamp}\n`;
  report += `**Проанализировано файлов:** ${totalFiles}\n`;
  report += `**Обнаружено проблем:** ${totalIssues}\n`;
  report += `**Предупреждений:** ${totalWarnings}\n`;
  report += `**Рекомендаций:** ${totalRecommendations}\n\n`;
  
  report += `## Сводка\n\n`;
  
  if (totalIssues === 0 && totalWarnings === 0) {
    report += `✅ Все компоненты соответствуют правилам проекта!\n\n`;
  } else {
    if (totalIssues > 0) {
      report += `❌ **Критические проблемы:** ${totalIssues}\n`;
    }
    if (totalWarnings > 0) {
      report += `⚠️  **Предупреждения:** ${totalWarnings}\n`;
    }
    if (totalRecommendations > 0) {
      report += `💡 **Рекомендации по улучшению:** ${totalRecommendations}\n`;
    }
    report += `\n`;
  }
  
  // Детальный анализ по файлам
  analysisResults.forEach(result => {
    if (result.issues.length === 0 && result.warnings.length === 0 && result.recommendations.length === 0) {
      return;
    }
    
    report += `## ${result.file}\n\n`;
    report += `*Строк кода: ${result.stats.lines}*\n\n`;
    
    // Проблемы
    if (result.issues.length > 0) {
      report += `### ❌ Критические проблемы\n\n`;
      result.issues.forEach(issue => {
        report += `- **${issue.message}**\n`;
        report += `  - Правило: ${issue.rule}\n`;
        report += `  - Рекомендация: ${issue.suggestion}\n\n`;
      });
    }
    
    // Предупреждения
    if (result.warnings.length > 0) {
      report += `### ⚠️  Предупреждения\n\n`;
      result.warnings.forEach(warning => {
        report += `- **${warning.message}**\n`;
        report += `  - Правило: ${warning.rule}\n`;
        report += `  - Рекомендация: ${warning.suggestion}\n\n`;
      });
    }
    
    // Рекомендации
    if (result.recommendations.length > 0) {
      report += `### 💡 Рекомендации по улучшению\n\n`;
      result.recommendations.forEach(rec => {
        report += `- **${rec.message}**\n`;
        report += `  - Рекомендация: ${rec.suggestion}\n\n`;
      });
    }
    
    report += `---\n\n`;
  });
  
  // Добавляем общие рекомендации
  if (totalIssues > 0) {
    report += `## 🚨 Требуются действия\n\n`;
    report += `Следующие критические проблемы блокируют соответствие правилам проекта:\n\n`;
    
    analysisResults.forEach(result => {
      result.issues.forEach(issue => {
        report += `1. **${result.file}**: ${issue.message}\n`;
      });
    });
    
    report += `\n`;
  }
  
  // Добавляем ссылку на правила
  report += `## 📚 Ссылки\n\n`;
  report += `- [Правила проекта](.cursorrules)\n`;
  report += `- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)\n`;
  report += `- [Vuetify документация](https://vuetifyjs.com/en/)\n`;
  report += `- [Pinia документация](https://pinia.vuejs.org/)\n`;
  
  return report;
}

// Основная функция
async function main() {
  console.log('🔍 Запуск AI-ревью измененных компонентов...\n');
  
  // Читаем правила проекта
  const rules = readProjectRules();
  if (!rules) {
    console.error('Прерывание: правила проекта не найдены');
    process.exit(1);
  }
  
  // Получаем измененные Vue файлы
  const changedFiles = getChangedVueFiles();
  
  if (changedFiles.length === 0) {
    console.log('✅ Нет измененных Vue компонентов для анализа');
    fs.writeFileSync(REPORT_FILE, '# AI Review Report\n\nНет измененных Vue компонентов для анализа.\n');
    return;
  }
  
  console.log(`📁 Найдено ${changedFiles.length} измененных Vue компонентов:`);
  changedFiles.forEach(file => {
    console.log(`  - ${path.relative(PROJECT_ROOT, file)}`);
  });
  console.log('');
  
  // Анализируем каждый файл
  const analysisResults = [];
  for (const file of changedFiles) {
    try {
      console.log(`🔬 Анализ: ${path.relative(PROJECT_ROOT, file)}`);
      const result = analyzeVueComponent(file);
      analysisResults.push(result);
      
      const { issuesCount, warningsCount, recommendationsCount } = result.stats;
      if (issuesCount > 0 || warningsCount > 0) {
        console.log(`   ❌ Проблемы: ${issuesCount}, ⚠️  Предупреждения: ${warningsCount}, 💡 Рекомендации: ${recommendationsCount}`);
      } else {
        console.log(`   ✅ Все в порядке`);
      }
    } catch (error) {
      console.error(`   ❌ Ошибка анализа: ${error.message}`);
    }
  }
  
  // Генерируем отчет
  const report = generateReport(analysisResults);
  fs.writeFileSync(REPORT_FILE, report);
  
  console.log(`\n📄 Отчет сохранен в: ${REPORT_FILE}`);
  
  // Подводим итоги
  const totalIssues = analysisResults.reduce((sum, r) => sum + r.stats.issuesCount, 0);
  const totalWarnings = analysisResults.reduce((sum, r) => sum + r.stats.warningsCount, 0);
  
  if (totalIssues > 0) {
    console.log(`\n🚨 Обнаружено ${totalIssues} критических проблем!`);
    console.log('Рекомендуется исправить их перед пушем.');
    console.log(`Подробности в файле: ${REPORT_FILE}`);
    // Не блокируем пуш, только информируем
  } else if (totalWarnings > 0) {
    console.log(`\n⚠️  Обнаружено ${totalWarnings} предупреждений`);
    console.log(`Подробности в файле: ${REPORT_FILE}`);
  } else {
    console.log(`\n✅ Все компоненты соответствуют правилам проекта!`);
  }
}

// Запуск
main().catch(error => {
  console.error('❌ Ошибка при выполнении AI-ревью:', error);
  process.exit(1);
});