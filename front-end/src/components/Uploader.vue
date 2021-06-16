<template>
<div class="main">
  <form class="pure-form" @submit.prevent="upload">
    <div @click="chooseImage">
      <img v-if="url" :src="url" />
        <div v-if="!url" class="imageInput">
          Choose an Image
        </div>
      <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
    </div>

    <fieldset>
      <div class="pure-control-group">
        <label for="animationTitle">Title: </label>
        <input v-model="title" placeholder="animation title" id="animationTitle">
      </div>
      <div class="pure-control-group">
        <label for="companyName">Production Company: </label>
        <input v-model="companyName" placeholder="production company name" id="companyName">
      </div>
      <div class="pure-control-group">
        <label for="publishedYear">Published Year: </label>
        <input type="number" v-model="publishedYear" id="publishedYear">
      </div>
      <div class="pure-control-group">
        <label for="seasons">Total seasons: </label>
        <input type="number" v-model="seasons" id="seasons">
      </div>
      <div class="pure-control-group">
        <label for="episodes">Total episodes: </label>
        <input type="number" v-model="episodes" id="episodes">
      </div>

      <button type="submit" class="pure-button pure-button-primary right">Upload</button>
    </fieldset>
  </form>
  <p v-if="error" class="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Uploader',
  data() {
    return {
      title: '',
      url: '',
      file: null,
      companyName: '',
      publishedYear: 2000,
      seasons: 1,
      episodes: 12,
      error: '',
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file);
    },
    chooseImage() {
      this.$refs.fileInput.click()
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('animation', this.file, this.file.name);
        formData.append('title', this.title);
        formData.append('company', this.companyName);
        formData.append('publishedYear', this.publishedYear);
        formData.append('seasons', this.seasons);
        formData.append('episodes', this.episodes);
        await axios.post("/api/animations", formData);
        this.file = null;
        this.url = '';
        this.title = '';
        this.companyName = '';
        this.publishedYear = 2000;
        this.episodes = 1;
        this.episodes = 12;
      } catch (error) {
        this.error = "Error: " + error.response.data.message;
      }
    }
  }
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pure-form {
  display: flex;
  margin-bottom: 40px;
}

.imageInput {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F0F0F0;
  width: 400px;
  height: 500px;
  font-style: italic;
  color: #898989;
}

img {
  width: 400px;
  height: 500px;
}

.fileInput {
  display: none;
}

fieldset {
  text-align: right;
  margin-left: 30px;
}

.pure-control-group {
  margin: 15px 0;
}

@media screen and (max-width: 470px) {
  .imageInput {
    font-size: 8px;
    width: 100px;
    height: 150px;
  }

  img {
    width: 100px;
    height: 150px;
  }

  fieldset {
    font-size: 8px;
  }

  .pure-control-group {
    margin: 5px 0;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  .imageInput {
    font-size: 10px;
    width: 180px;
    height: 250px;
  }

  img {
    width: 180px;
    height: 250px;
  }

  fieldset {
    font-size: 12px;
  }

  .pure-control-group {
    margin: 8px 0;
  }
}
</style>
