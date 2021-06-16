<template>
  <div class="main">
    <div class='animation-container'>
      <img :src="animation.path" />
      <h1 class="animationTitle">{{animation.title}}</h1>
      <div class="animationInfo">
        <p class="animationCompany">Company: {{animation.company}}</p>
        <p class="animationpublishedYear">Published Year: {{animation.publishedYear}}</p>
        <p class="animationSeason">Total Season: {{animation.seasons}}</p>
        <p class="animationEpisode">Total Episode: {{animation.episodes}}</p>
      </div>

      <div class="buttons" v-if="user">
        <div v-if="checkInList">
          <button class="pure-button" @click="deleteAnimeFromList()">Remove from list <i class="fa fa-minus-circle"></i></button>
        </div>
        <div v-else>
          <button class="pure-button" @click="addList">Add to list <i class="fa fa-plus-circle"></i></button>
        </div>
        <div class="watched">
          <label for="watchedCheckbox" class="pure-checkbox">Watched:
            <input type="checkbox" id="watchedCheckbox" @click="setWatched" :checked="this.watched">
          </label>
        </div>
      </div>
    </div>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AnimationInfo',
  data() {
    return {
      animation: null,
      watched: null,
      inList: null,
      error: ''
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    checkInList() {
      return this.inList;
    }
  },
  created() {
    this.getAnimation();
    this.getUser();
    this.checkWatched();
    this.checkList();
  },
  methods: {
    async getUser() {
      try {
        let response = await axios.get("/api/users");
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async getAnimation() {
      try {
        let id = this.$route.query.id;
        let response = await axios.get("/api/animations/" + id);
        this.animation = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async checkList() {
      try {
        if (!this.$root.$data.user)
          return;

        let id = this.$route.query.id;
        let response = await axios.get("/api/lists/" + id);
        this.inList = response.data;
        } catch (error) {
          if (error.response.data.message === "It is not in list"){
            this.error = '';
            this.inList = null;
          }
          else
            this.error = error.response.data.message;
        }
    },
    async addList() {
      try {
        this.error = '';
        let id = this.$route.query.id;
        await axios.post("/api/lists/" + id);
        this.checkList();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async deleteAnimeFromList() {
      try {
        let id = this.$route.query.id;
        await axios.delete("/api/lists/" + id);
        this.checkList();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async checkWatched() {
      try {
        if (!this.$root.$data.user)
          return;

        let id = this.$route.query.id;
        let response = await axios.get("/api/users/" + id);
        this.watched = response.data;
      } catch (error) {
        if (error.response.data.message === "It is not watched")
          this.error = '';
        else
          this.error = error.response.data.message;
      }
    },
    async setWatched() {
      try {
        this.error = '';
        let id = this.$route.query.id;

        if (!this.watched) {
          let response = await axios.put("/api/users/addWatched/" + id);
          this.watched = response.data;
          await axios.delete("/api/lists/" + id);
        }
        else {
          await axios.put("/api/users/removeWatched/" + id);
          this.watched = null;
        }
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding-bottom: 5%;
}

.animation-container {
  display: table;
  text-align: center;
}

.animationTitle {
  text-align: right;
  padding-bottom: 10px;
  border-bottom: 1px solid #B5B5B5;
}

.animationInfo {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 10px;
  border-bottom: 1px solid #B5B5B5;
}

img {
  width: 500px;
  height: 600px;
}

button {
  margin-right: 5px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.watched {
  padding: 0.5em 1em;
  background-color: #e6e6e6;
  font-size: 100%;
}

@media screen and (max-width: 470px) {
  img {
    width: 200px;
    height: 300px;
  }

  .animationTitle {
    font-size: 20px;
  }

  .animationInfo {
    font-size: 12px;
  }

  .buttons {
    font-size: 10px;
  }

  .watched {
    padding: 0.4em 1em;
    font-size: 10px;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  img {
    width: 300px;
    height: 400px;
  }

  .animationTitle {
    font-size: 25px;
  }

  .animationInfo {
    font-size: 15px;
  }

  .buttons {
    font-size: 15px;
  }

  .watched {
    padding: 0.6em 1em;
    font-size: 15px;
  }
}
</style>
