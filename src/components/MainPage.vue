<template>
  <div>
    <main-header />
    <body class="body">
      <h2>О сервисе:</h2>
      <div class="description">
        <p class="description-text">
          Наш сервис поможет вам принимать осознанные решения и выбирать
          полезные занятия вместо вредных привычек. Просто введите список ваших
          любимых занятий и время, которое вы хотите уделить привычке, и наш
          сервис подскажет полезное занятие вместо этого.
        </p>
        <img
          class="description-image"
          src="https://vamber.ru/wp-content/uploads/2021/03/3475771-scaled.jpg"
          alt="йога"
        />
      </div>

      <section>
        <h2>Полезные дела</h2>
        <p>
          Введите несколько полезных или нужных дел, до которых постоянно не
          доходят руки :)
        </p>
        <form class="useful-form" @submit.prevent="addUseful">
          <div class="form-item">
            <label class="form-label" for="useful">Полезное дело</label>
            <input
              v-model="currentUseful"
              placeholder="Что нужно сделать"
              class="form-input"
              id="useful"
              name="useful"
              type="text"
            />
          </div>
          <button
            :disabled="!currentUseful.length"
            class="form-button"
            type="submit"
          >
            Добавить
          </button>
        </form>
        <h3>Список полезных дел:</h3>
        <ul>
          <li :key="i" v-for="(useful, i) in usefulsList">{{ useful }}</li>
        </ul>

        <h2>Чем хотите заняться сейчас:</h2>
        <form @submit.prevent="addHarmfulHabit">
          <div class="form-item">
            <label class="form-label" for="harmful">Вредная привычка</label>
            <input
              v-model="currentHarmfulHabit"
              placeholder="Что будете делать"
              class="form-input"
              id="harmful"
              name="harmful"
              type="text"
            />
          </div>

          <div class="form-item">
            <label for="time-to-harmful"
              >Сколько времени готовы потратить:
            </label>
            <input v-model="time" id="time-to-harmful" type="time" />
          </div>
          <button type="submit">Начать</button>
        </form>
      </section>
    </body>
  </div>
</template>

<script>
import MainHeader from "./MainHeader.vue";
export default {
  components: {
    "main-header": MainHeader,
  },
  data() {
    return {
      usefulsList: ["Почитать", "Заняться спортом", "Заняться английским"],
      currentUseful: "",
      currentHarmfulHabit: "",
      time: "00:15",
    };
  },
  methods: {
    addUseful() {
      this.usefulsList.push(this.currentUseful);
      this.currentUseful = "";
    },
    addHarmfulHabit() {},
  },
};
</script>

<style scoped>
.body {
  padding: 40px;
  min-height: 80vh;
  background: #f4f4f4;
}

.description {
  display: flex;
  justify-content: space-between;
}
.description-text {
  font-size: 24px;
  margin-right: 40px;
  font-style: italic;
}
.description-image {
  width: 40%;
}
.form-label {
  display: block;
}
.useful-form {
  display: flex;
}
.form-button {
  margin-left: 15px;
}
</style>
