<template>
<transition v-if="show" name="create-container">
  <div class="create">
    <form class="pure-form pure-form-aligned" @submit.prevent="create">
      <legend>Create an account</legend>
      <fieldset class="inputs">
        <div class="pure-control-group">
          <label for="firstName">First name</label>
          <input v-model="firstName" placeholder="first name" id="firstName">
        </div>
        <div class="pure-control-group">
          <label for="lastName">Last name</label>
          <input v-model="lastName" placeholder="last name" id="lastName">
        </div>
        <div class="pure-control-group">
          <label for="username">Username</label>
          <input v-model="username" placeholder="username" id="username">
          <span class="pure-form-message-inline">Least 8 words</span>
        </div>
        <div class="pure-control-group">
          <label for="password">Password</label>
          <input v-model="password" placeholder="password" id="password" type="password">
          <span class="pure-form-message-inline">Least 8 words</span>
        </div>
      </fieldset>
      <fieldset class="buttons">
        <button type="button" @click="close" class="pure-button">Close</button>
        <button type="submit" class="pure-button pure-button-primary right">Create</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
  </div>
</transition>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CreateAccount',
  props: {
    show: Boolean,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async create() {
      this.error = '';

      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;

      try {
        await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.password = '';
        this.$emit('accountCreated');
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    close() {
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.password = '';
      this.created = false;
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
.create {
  width: 30%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

legend {
  border-bottom: 2px solid #C6C6C6;
}

.buttons {
  text-align: right;
}

.pure-button {
  border-radius: 5px;
}

.error {
  background-color: #C54E4A;
  color: white;
  text-align: center;
  font-size: 20px;
  padding: 20px;
  border-radius: 15px;
}

@media screen and (max-width: 470px) {
  fieldset {
    font-size: 10px;
  }

  .buttons {
    text-align: right;
  }

  button {
    margin: 0.7em 0 0;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  fieldset {
    font-size: 12px;
  }

  .buttons {
    text-align: right;
  }

  button {
    margin: 0.7em 0 0;
  }
}
</style>
