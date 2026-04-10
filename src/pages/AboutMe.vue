<template>
  <div>
    <v-container class="body">
      <h2 class="title">О проекте</h2>

      <div class="hero">
        <div class="hero-text">
          <p class="lead">
            Наше время — бесценный актив. Мы не можем «купить» лишний час, но
            можем выбирать, на что он уйдёт.
          </p>
          <p class="muted">
            Conscious помогает принимать решения осознанно: увидеть варианты,
            выбрать действие и при желании зафиксировать его таймером.
          </p>

          <v-card elevation="3" class="card">
            <v-card-title>Как это работает</v-card-title>
            <v-card-text>
              <ul class="list">
                <li>
                  <strong>Список дел</strong> — добавь задачи, которые важны
                  именно тебе.
                </li>
                <li>
                  <strong>Выбор «чем заняться сейчас»</strong> — опиши намерение
                  (включая отдых).
                </li>
                <li>
                  <strong>AI-чат</strong> — помогает увидеть альтернативы и
                  сформулировать следующий шаг.
                </li>
                <li>
                  <strong>Таймер</strong> — включай, если хочешь ограничить
                  время или сфокусироваться.
                </li>
              </ul>
            </v-card-text>
          </v-card>

          <v-alert type="info" variant="tonal" class="mt-4">
            Сервис не оценивает и не упрекает. Его цель — сделать выбор заметным
            и управляемым.
          </v-alert>
        </div>

        <v-img
          class="hero-image"
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80"
          alt="время и фокус"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.body {
  padding: 40px;
  min-height: 80vh;
  background: #f7f8fb;
}
.title {
  margin-bottom: 24px;
}
.hero {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 24px;
  align-items: start;
}
.lead {
  font-size: 20px;
  line-height: 1.45;
  font-weight: 700;
  margin-bottom: 10px;
}
.muted {
  opacity: 0.85;
  margin-bottom: 16px;
}
.card {
  border-radius: 12px;
}
.list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}
.hero-image {
  border-radius: 14px;
  min-height: 320px;
}

@media screen and (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-image {
    min-height: 240px;
  }
}
</style>
