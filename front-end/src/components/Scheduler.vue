<template>
  <div class="main">
    <div class="userSchedule">
      <div v-if="schedule.length === 0" class="noSchedule">
        Add animation
      </div>

      <carousel v-else class="story-carousel">
        <slide class="scheduledAnimation" v-for="scheduled in schedule" v-bind:key="scheduled.animation._id">
          <router-link :to="{ name: 'Animation', query: { id:scheduled.animation._id }}"><img :src="scheduled.animation.path" /></router-link>
          <p class="scheduleTitle">{{scheduled.animation.title}}</p>
          <p class="scheduleStatus" v-if="currentlyWatching === scheduled.animation._id">Currently watching</p>
          <p class="scheduleStatus" v-if="nextToWatch === scheduled.animation._id">Next to watch</p>
          <button class="removeButton" @click="removeSchedule(scheduled.animation._id)"><i class="fa fa-arrow-circle-right"></i></button>
        </slide>
      </carousel>
    </div>

    <div class="divideLine"></div>

    <div class="myList">
      <div class="list-animation" v-for="list in notScheduled" v-bind:key="list.animation._id">
        <router-link :to="{ name: 'Animation', query: { id:list.animation._id }}"><img :src="list.animation.path" /></router-link>
        <p>{{list.animation.title}}</p>
        <button class="addButton" @click="addSchedule(list.animation._id)"><i class="fa fa-arrow-circle-left"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Carousel, Slide } from 'vue-snap'
import 'vue-snap/dist/vue-snap.css'
export default {
  name: "Scheduler",
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      notScheduled: [],
      schedule: [],
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    currentlyWatching() {
      return this.schedule[0].animation._id;
    },
    nextToWatch() {
      if (this.schedule.length > 1)
        return this.schedule[1].animation._id;
      return false;
    }
  },
  created() {
    this.getNotScheduledlist();
    this.getSchedule();
    this.getUser();
  },
  methods: {
    async getNotScheduledlist() {
      try {
        let response = await axios.get("/api/lists/notScheduled");
        this.notScheduled = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getSchedule() {
      try {
        let response = await axios.get("/api/lists/schedule");
        this.schedule = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async addSchedule(id) {
      try {
        await axios.put("/api/lists/addSchedule/" + id);
        this.getNotScheduledlist();
        this.getSchedule();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async removeSchedule(id) {
      try {
        await axios.put("/api/lists/removeSchedule/" + id);
        this.getNotScheduledlist();
        this.getSchedule();
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
  }
};
</script>

<style scoped>
.scheduledAnimation {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 750px;
  font-size: 15px;
  color: #FFFFFF;
  background: #2C0035;
}

.scheduledAnimation img {
  width: 500px;
  height: 600px;
}

.story-carousel {
  width: 50%;
}

.main {
  display: flex;
}

.userSchedule {
  display: flex;
  width: 70%;
  justify-content: center;
  align-items: center;
}

.noSchedule {
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
  color: #A2A2A2;
  background-color: #E2E2E2;
  padding: 20% 10%;
  border: 0.5px solid #C4C4C4;
}

.scheduleStatus {
  position: relative;
}

.divideLine {
  margin-top: 100px;
  border-left: 5px solid #2C0035;
  height: 600px;
}

.myList {
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  height: 800px;
  margin-left: 5%;
}

.list-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #D8D8D8;
  margin-bottom: 3%;
}

img {
  width: 300px;
  height: 350px;
}

.addButton {
  font-size: 150%;
  border: none;
  background-color: #D8D8D8;
}

button:hover {
  color: #545454;
}

.removeButton {
  font-size: 150%;
  border: none;
  background-color: #2C0035;
}

@media screen and (max-width: 470px) {
  img {
    width: 70px;
    height: 90px;
  }

  .scheduledAnimation img {
    width: 100px;
    height: 150px;
  }

  .story-carousel {
    width: 180px;
  }

  .scheduledAnimation {
    height: 250px;
    font-size: 10px;
  }

  .noSchedule {
    padding: 20% 10%;
  }

  .scheduleTitle {
    text-align: center;
    width: 100px;
  }

  .list-animation {
    font-size: 10px;
    width: 70px;
  }

  .list-animation p {
    display: none;
  }

  .divideLine {
    margin-top: 80px;
    border-left: 3px solid #2C0035;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  img {
    width: 100px;
    height: 150px;
  }

  .list-animation {
    font-size: 10px;
    width: 100px;
  }

  .scheduledAnimation img {
    width: 200px;
    height: 250px;
  }

  .story-carousel {
    width: 280px;
  }

  .scheduledAnimation {
    height: 360px;
    font-size: 10px;
  }

  .noSchedule {
    width: 160px;
    height: 250px;
  }

  .scheduleTitle {
    text-align: center;
    width: 100px;
  }

  .list-animation p {
    display: none;
  }

  .divideLine {
    margin-top: 80px;
    border-left: 3px solid #2C0035;
  }
}

@media screen and (min-width: 801px) and (max-width: 1200px) {
  .scheduledAnimation img {
    width: 250px;
    height: 300px;
  }

  .story-carousel {
    width: 350px;
  }

  .scheduledAnimation {
    height: 450px;
    font-size: 15px;
  }

  .noSchedule {
    width: 200px;
    height: 300px;
  }

  .scheduleTitle {
    text-align: center;
    width: 200px;
  }

  .list-animation p {
    display: none;
  }

  .divideLine {
    margin-top: 80px;
    border-left: 5px solid #2C0035;
  }
}

@media screen and (min-width: 1201px) and (max-width: 1500px) {
  .scheduledAnimation img {
    width: 350px;
    height: 450px;
  }

  .story-carousel {
    width: 550px;
  }

  .scheduledAnimation {
    height: 650px;
    font-size: 20px;
  }

  .noSchedule {
    width: 200px;
    height: 300px;
  }

  .scheduleTitle {
    text-align: center;
    width: 300px;
  }
}

@media screen and (min-width: 1501px) and (max-width: 1800px) {
  .scheduledAnimation img {
    width: 400px;
    height: 550px;
  }
}
</style>
