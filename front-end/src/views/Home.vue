<template>
  <div class="main">
    <div class="search">
      <form class="pure-form" @submit.prevent="search">
        <input v-model="searchText" />
        <button type="submit" class="pure-button-primary">Search</button>
      </form>
    </div>

    <div class="animation-container">
      <div class="animation-list" v-for="animation in animations" v-bind:key="animation._id">
        <router-link :to="{ name: 'Animation', query: { id:animation._id }}"><img class="pure-img" :src="animation.path" /></router-link>
        <p>{{animation.title}}</p>

        <div v-if="user">
          <button @click="addList(animation._id)"><i class="fa fa-plus-circle"></i></button>
        </div>
      </div>
    </div>
    <p v-if="error" class="error">{{error}}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
      animations: [],
      searchText: '',
      error: '',
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  created() {
    this.getAnimations();
    this.getUser();
  },
  methods: {
    async getAnimations() {
      try {
        let response = await axios.get("/api/animations");
        this.animations = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getUser() {
      try {
        let response = await axios.get("/api/users");
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async addList(id) {
      try {
        this.error = '';
        await axios.post("/api/lists/" + id);
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    search() {
      if (this.searchText === "")
        this.getAnimations();
      else
        this.animations = this.animations.filter(animation => animation.title.toLowerCase().search(this.searchText.toLowerCase()) >= 0);
    }
  }
};
</script>

<style scoped>
.search {
  display: flex;
  margin-bottom: 1.5%;
  justify-content: flex-end;
}

form {
  width: 40%;
  text-align: right;
}

.search input {
  padding: 0;
  font-size: 150%;
}

.search button {
  font-size: 150%;
  background-color: #2C0035;
  border-radius: 10px;
  margin-left: 1%;
}

.search button:hover {
  color: #B1B1B1;
}

.animation-container {
  display: grid;
  grid-template-columns: 250px 250px 250px 250px 250px;
  grid-column-gap: 2%;
  grid-row-gap: 2%;
  justify-content: center;
  width: 100%;
}

.animation-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #D8D8D8;
}

p {
  font-weight: bold;
  margin: 2% 0 0 0;
  text-align: center;
}

img {
  width: 100%;
  height: 300px;
}

button {
  font-size: 150%;
  border: none;
  background-color: #D8D8D8;
  margin-top: 2%;
}

button:hover {
  color: #545454;
}

@media screen and (max-width: 470px) {
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .search input {
    font-size: 50%;
  }

  .search button {
    font-size: 50%;
    margin-bottom: 8px;
  }

  .animation-container {
    grid-template-columns: 80px 80px 80px;
  }

  p {
    font-size: 10px;
  }

  img {
    width: 80px;
    height: 100px;
  }

  button {
    font-size: 60%;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .search input {
    font-size: 70%;
  }

  .search button {
    font-size: 70%;
    margin-bottom: 12px;
  }

  .animation-container {
    grid-template-columns: 100px 100px 100px 100px;
  }

  p {
    font-size: 10px;
  }

  img {
    width: 100px;
    height: 140px;
  }

  button {
    font-size: 80%;
  }
}

@media screen and (min-width: 801px) and (max-width: 1100px) {
  .search input {
    font-size: 100%;
  }

  .search button {
    font-size: 100%;
    margin-bottom: 15px;
  }

  .animation-container {
    grid-template-columns: 120px 120px 120px 120px 120px;
  }

  p {
    font-size: 10px;
  }

  img {
    width: 120px;
    height: 180px;
  }

  button {
    font-size: 90%;
  }
}

@media screen and (min-width: 1101px) and (max-width: 1400px) {
  .search input {
    font-size: 100%;
  }

  .search button {
    font-size: 100%;
    margin-bottom: 15px;
  }

  .animation-container {
    grid-template-columns: 150px 150px 150px 150px 150px;
  }

  p {
    font-size: 12px;
  }

  img {
    width: 150px;
    height: 200px;
  }

  button {
    font-size: 100%;
  }
}

@media screen and (min-width: 1401px) and (max-width: 1500px) {
  .animation-container {
    grid-template-columns: 200px 200px 200px 200px 200px;
  }

  img {
    width: 200px;
    height: 250px;
  }
}
</style>
