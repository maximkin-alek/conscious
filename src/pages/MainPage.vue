<template>
  <div>
    <v-container class="body">
      <h2 class="title">О сервисе:</h2>
      <div class="description">
        <p class="description-text">
          Наш сервис поможет вам принимать осознанные решения и выбирать
          полезные занятия вместо вредных привычек. Просто введите список ваших
          любимых занятий и время, которое вы хотите уделить вредной привычке, а
          наш сервис установит таймер и подскажет полезное занятие вместо этого.
        </p>
        <v-img
          class="description-image"
          src="https://vamber.ru/wp-content/uploads/2021/03/3475771-scaled.jpg"
          alt="йога"
        />
      </div>

      <section>
        <h2 class="title">Полезные дела</h2>
        <p class="subtitle">
          Добавьте несколько полезных дел, до которых постоянно не доходят руки
          &#128578;
        </p>
        <v-form
          v-model="usefulFormValid"
          lazy-validation
          ref="usefulForm"
          class="useful-form"
          @submit.prevent="addUsefulActivity"
        >
          <div class="form-item">
            <v-text-field
              v-model="currentUseful"
              required
              placeholder="Что нужно сделать"
              class="form-input"
              :rules="inputRules"
              :counter="50"
            />
          </div>
          <v-btn class="form-button" type="submit">Добавить</v-btn>
        </v-form>
        <div class="content-block">
          <v-card elevation="4" shaped>
            <v-card-title>Список полезных дел:</v-card-title>
            <v-list>
              <v-list-item-content
                ><v-list-item
                  class="form-list-item"
                  :key="i"
                  v-for="(useful, i) in usefulsList"
                >
                  <v-list-item-title class="form-text">
                    {{ i + 1 }}. {{ useful }}
                    <v-btn
                      @click="deleteListItem(useful)"
                      class="form-delete-button"
                      x-small
                      icon
                      raised
                    >
                      <v-icon color="red">mdi-delete-circle</v-icon>
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-content>
            </v-list> </v-card
          ><v-img
            class="harmful-image"
            src="https://ferret-pet.ru/wp-content/uploads/7/a/9/7a94f948d1261bd441561f5e72b50385.jpeg"
            alt="Кот учится"
          />
        </div>
        <div class="content-block">
          <v-img
            class="harmful-image"
            src="https://gamerwall.pro/uploads/posts/2022-12/1671145941_gamerwall-pro-p-progulka-v-gorakh-krasivo-67.jpg"
            alt="Вид на горы"
          />
          <v-form
            v-model="harmfulFormValid"
            lazy-validation
            ref="harmfulForm"
            @submit.prevent="addHarmfulHabit"
          >
            <h2 class="title">Чем хотите заняться сейчас:</h2>
            <div class="form-items">
              <div class="form-item">
                <v-text-field
                  :rules="inputRules"
                  :counter="50"
                  required
                  v-model="currentHarmfulHabit"
                  placeholder="Что будете делать"
                  class="form-input"
                />
              </div>

              <div class="time-form-item">
                <label for="time-to-harmful"
                  >Сколько времени собираетесь потратить:
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
            </div>

            <main-popup
              :time="time"
              :harmful="currentHarmfulHabit"
              :usefull="getRandomUseful()"
              :formIsValid="harmfulFormValid"
            />
          </v-form>
        </div>
      </section>
    </v-container>
  </div>
</template>

<script>
import MainPopup from "../components/MainPopup.vue";
import { mapActions, mapGetters } from "vuex";
import randomArrayElement from "../mixins/randomArrayElement";

export default {
  components: {
    "main-popup": MainPopup,
  },
  mixins: [randomArrayElement],
  data() {
    return {
      currentUseful: "",
      currentHarmfulHabit: "",
      time: "00:15",
      usefulFormValid: false,
      harmfulFormValid: false,
      inputRules: [
        (v) => Boolean(v) || "Необходимо заполнить поле",
        (v) => (Boolean(v) && v.length <= 50) || "Не больше 50 знаков ",
      ],
    };
  },
  methods: {
    ...mapActions({
      addUseful: "usefuls/addUseful",
      deleteUseful: "usefuls/deleteUseful",
    }),

    addUsefulActivity() {
      if (this.$refs.usefulForm.validate()) {
        this.addUseful(this.currentUseful);
        this.$refs.usefulForm.reset();
      }
    },
    addHarmfulHabit() {},
    deleteListItem(itemName) {
      this.deleteUseful(itemName);
    },
    getRandomUseful() {
      return this.getRandomArrayElement(this.usefulsList);
    },
  },
  computed: {
    ...mapGetters({ getUsefulsList: "usefuls/getUsefulsList" }),
    usefulsList() {
      return this.getUsefulsList;
    },
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
  font-family: "Ubuntu", sans-serif;
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
  padding: 16px;
  justify-content: center;
  border: 1px solid grey;
  border-radius: 6px;
}
.form-item {
  width: 50%;
}
.form-text {
  font-family: "Ubuntu", sans-serif;
  font-size: 18px;
  line-height: 32px;
  font-weight: 500;
}
.form-list-item {
  min-height: 32px;
  border-bottom: 1px solid lightgrey;
}
.form-delete-button {
  margin-left: 8px;
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
.subtitle {
  font-family: "Ubuntu", sans-serif;
  font-size: 16px;
  font-weight: 600;
  font-style: italic;
}
.content-block {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 4fr 6fr;
  column-gap: 16px;
}
@media screen and (max-width: 1024px) {
  .body {
    padding: 24px;
  }
  .description {
    display: block;
  }
  .description-image {
    width: 100%;
  }
  .time-form-item {
    max-width: 80%;
  }
}
@media screen and (max-width: 768px) {
  .body {
    padding: 16px;
  }
  .description-text {
    font-size: 16px;
  }
  .description-image {
    width: 100%;
  }
  .useful-form {
    display: block;
  }
  .form-item {
    width: 100%;
  }
  .form-text {
    font-size: 14px;
    line-height: 24px;
  }
  .form-button {
    display: block;
    margin: 0 auto;
  }
  .content-block {
    display: block;
  }
  .content-block:last-of-type {
    display: flex;
    flex-direction: column-reverse;
  }
  .time-form-item {
    max-width: 100%;
  }
}
</style>
