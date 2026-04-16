<template>
  <div class="page-wrapper">
    <v-container class="main-container">
      <header class="page-header">
        <span class="header-icon">🌿</span>
        <h1 class="page-title">О проекте</h1>
      </header>

      <div class="about-layout">
        <div class="about-content">
          <p class="lead">
            Наше время — бесценный актив. Мы не можем «купить» лишний час, но
            можем выбирать, на что он уйдёт.
          </p>
          <p class="muted">
            Conscious помогает принимать решения осознанно: увидеть варианты,
            выбрать действие и при желании зафиксировать его таймером.
          </p>

          <v-card elevation="0" class="features-card">
            <v-card-title class="features-title">Как это работает</v-card-title>
            <v-card-text>
              <div class="features-grid">
                <div class="feature-item">
                  <span class="feature-icon">📝</span>
                  <div class="feature-content">
                    <strong>Список дел</strong>
                    <p>Добавь задачи, которые важны именно тебе.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🎯</span>
                  <div class="feature-content">
                    <strong>Выбор занятия</strong>
                    <p>Опиши намерение (включая отдых).</p>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💬</span>
                  <div class="feature-content">
                    <strong>AI-чат</strong>
                    <p>Помогает увидеть альтернативы и следующий шаг.</p>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">⏱</span>
                  <div class="feature-content">
                    <strong>Таймер</strong>
                    <p>Ограничь время или сфокусируйся.</p>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <div class="philosophy-block">
            <span class="philosophy-icon">✨</span>
            <p class="philosophy-text">
              Сервис не оценивает и не упрекает. Его цель — сделать выбор
              заметным и управляемым.
            </p>
          </div>
        </div>

        <div class="about-image-wrapper">
          <img
            class="about-image"
            src="https://cdn1.ozone.ru/s3/multimedia-1/6447924457.jpg"
            alt="Время и фокус"
          />
          <div class="image-decoration"></div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup></script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-sand-light);
}

.main-container {
  max-width: 1100px;
  padding: 48px 24px;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-icon {
  font-size: 56px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 500;
  color: var(--color-forest);
  margin: 0;
  text-align: center;
}

.about-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: 0.1s;
  animation-fill-mode: backwards;
}

.about-content {
  max-width: 600px;
}

.lead {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-forest);
  margin: 0 0 20px 0;
}

.muted {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-stone);
  margin: 0 0 32px 0;
}

.features-card {
  background: white !important;
  border-radius: var(--radius-medium) !important;
  box-shadow: var(--shadow-soft);
  margin-bottom: 28px;
}

.features-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--color-forest);
  padding: 24px 24px 8px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0 8px 16px;
}

.feature-item {
  display: flex;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.feature-item:hover {
  background: var(--color-sand-light);
}

.feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.feature-content strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-charcoal);
  margin-bottom: 4px;
}

.feature-content p {
  margin: 0;
  font-size: 13px;
  color: var(--color-stone);
  line-height: 1.5;
}

.philosophy-block {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--color-forest);
  border-radius: var(--radius-medium);
}

.philosophy-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.philosophy-text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-sand-light);
  margin: 0;
}

.about-image-wrapper {
  position: relative;
}

.about-image {
  width: 100%;
  height: 480px;
  object-fit: cover;
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-medium);
}

.image-decoration {
  position: absolute;
  top: 20px;
  left: 20px;
  right: -20px;
  bottom: -20px;
  border: 2px solid var(--color-terracotta);
  border-radius: var(--radius-medium);
  z-index: -1;
  opacity: 0.4;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .about-content {
    max-width: 100%;
    order: 2;
  }

  .about-image-wrapper {
    order: 1;
  }

  .about-image {
    height: 300px;
  }

  .image-decoration {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .main-container {
    padding: 32px 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .lead {
    font-size: 22px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
