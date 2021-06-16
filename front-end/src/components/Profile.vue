<template>
<div class="main">
  <div class="myList">
    <h1>My List</h1>
    <div class="list-animation" v-for="list in myList" v-bind:key="list.animation._id">
      <router-link :to="{ name: 'Animation', query: { id:list.animation._id }}"><img class="pure-img" :src="list.animation.path" /></router-link>
      <button @click="deleteAnimeFromList(list.animation._id)"><i class="fa fa-minus-circle"></i></button>
    </div>
  </div>

  <div class="myList">
    <h1>Watched</h1>
    <div class="list-animation" v-for="list in myWatchedList" v-bind:key="list._id">
      <router-link :to="{ name: 'Animation', query: { id:list._id }}"><img class="pure-img" :src="list.path" /></router-link>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
      myList: [],
      error: ''
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    myWatchedList() {
      return this.$root.$data.user.watched;
    }
  },
  created() {
    this.getMylist();
  },
  methods: {
    async getMylist() {
      try {
        let response = await axios.get("/api/lists");
        this.myList = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async deleteAnimeFromList(id) {
      try {
        await axios.delete("/api/lists/" + id);
        this.getMylist();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
h1 {
  color: #2C0035;
  padding: 5px;
  border-bottom: 2px solid #2C0035;
}

.myList {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.list-animation {
  display: inline-block;
  text-align: center;
  background-color: #D8D8D8;
  margin-left: 1.5%;
  margin-bottom: 1%;
}

img {
  width: 200px;
  height: 300px;
}

button {
  font-size: 130%;
  border: none;
  background-color: #D8D8D8;
  margin-top: 2%;
}

button:hover {
  color: #545454;
}

@media screen and (max-width: 470px) {
  h1 {
    font-size: 10px;
  }

  img {
    width: 100px;
    height: 150px;
  }

  .list-animation {
    width: 100px;
  }

  button {
    font-size: 60%;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  h1 {
    font-size: 18px;
  }

  img {
    width: 150px;
    height: 200px;
  }

  .list-animation {
    width: 150px;
  }

  button {
    font-size: 100%;
  }
}
</style>
