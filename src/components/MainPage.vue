<template>
  <div>
    <main-header />
    <v-main>
      <v-container class="body">
        <h2 class="title">О сервисе:</h2>
        <div class="description">
          <p class="description-text">
            Наш сервис поможет вам принимать осознанные решения и выбирать
            полезные занятия вместо вредных привычек. Просто введите список
            ваших любимых занятий и время, которое вы хотите уделить привычке, и
            наш сервис подскажет полезное занятие вместо этого.
          </p>
          <v-img
            class="description-image"
            src="https://vamber.ru/wp-content/uploads/2021/03/3475771-scaled.jpg"
            alt="йога"
          />
        </div>

        <section>
          <h2 class="title">Полезные дела</h2>
          <p>
            Введите несколько полезных, до которых постоянно не доходят руки :)
          </p>
          <form class="useful-form" @submit.prevent="addUseful">
            <div class="form-item">
              <v-text-field
                v-model="currentUseful"
                required
                placeholder="Что нужно сделать"
                class="form-input"
                id="useful"
                name="useful"
              />
            </div>
            <v-btn class="form-button" type="submit"> Добавить </v-btn>
          </form>
          <v-card elevation="4" shaped max-width="50%">
            <v-card-title>Список полезных дел:</v-card-title>
            <v-list>
              <v-list-item-content
                ><v-list-item :key="i" v-for="(useful, i) in usefulsList">
                  <v-list-item-title>
                    {{ useful }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-content>
            </v-list>
          </v-card>
          <h2 class="title">Чем хотите заняться сейчас:</h2>
          <form @submit.prevent="addHarmfulHabit">
            <div class="form-item">
              <v-text-field
                required
                v-model="currentHarmfulHabit"
                placeholder="Что будете делать"
                class="form-input"
                id="harmful"
                name="harmful"
              />
            </div>

            <div class="time-form-item">
              <label for="time-to-harmful"
                >Сколько времени готовы потратить:
              </label>
              <v-time-picker
                color="green lighten-1"
                v-model="time"
                id="time-to-harmful"
                ampm-in-title
                format="24hr"
                scrollable
              ></v-time-picker>
            </div>

            <main-popup
              :time="time"
              :harmful="currentHarmfulHabit"
              :usefull="usefulsList[0]"
            />
          </form>
        </section>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MainHeader from "./MainHeader.vue";
import MainPopup from "./MainPopup.vue";
export default {
  components: {
    "main-header": MainHeader,
    "main-popup": MainPopup,
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
  align-items: center;
}
.form-button {
  margin-left: 15px;
}
.time-form-item {
  display: flex;
  flex-direction: column;
  max-width: 50%;
  margin: 0 auto;
}

.title {
  margin-top: 25px;
}
</style>
