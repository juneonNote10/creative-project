<template>
<div class="login-container">
  <div class="login">
    <form class="pure-form-stacked">
      <fieldset>
        <legend>Login</legend>

        <label>Username</label>
        <input type="username" v-model="username" id="username" placeholder="username">

        <label>Password</label>
        <input type="password" v-model="password" id="password" placeholder="password">

        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
  </div>

  <a class="createAccount" @click="toggleCreate">Create account</a>
  <createAccount :show="show" @close="close" @accountCreated="accountCreated" />
  <p v-if="created" class="created">You have created a new account! Now you can login with your new account</p>
</div>
</template>

<script>
import axios from 'axios';
import CreateAccount from '@/components/CreateAccount.vue';
export default {
  name: 'Login',
  components: {
    CreateAccount
  },
  data() {
    return {
      username: '',
      password: '',
      show: false,
      created: false,
      error: '',
    }
  },
  methods: {
    async login() {
      this.error = '';

      if (!this.username || !this.password)
        return;

      try {
        let response = await axios.post('/api/users/login', {
          username: this.username,
          password: this.password
        });
        this.$root.$data.user = response.data.user;
        document.getElementById('divideLine').style.marginTop = '0px';
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    toggleCreate() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    accountCreated() {
      this.show = false;
      this.created = true;
    }
  }
}
</script>

<style scoped>
.login-container {
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login {
  text-align: center;
}

fieldset {
  font-size: 20px;
  padding: 20px 80px;
  border-radius: 10px;
}

button {
  margin-top: 20px;
}

.pure-button {
  border-radius: 10px;
}

.createAccount {
  margin-top: 15px;
  text-decoration: underline;
  color: #005AEC;
}

.createAccount:hover {
  color: #002869;
}

.created {
  background-color: #3C9E46;
  color: white;
  text-align: center;
  font-size: 18px;
  padding: 20px;
  border-radius: 15px;
}

@media screen and (max-width: 470px) {
  .login-container {
    padding-top: 10px;
  }

  fieldset {
    font-size: 10px;
    padding: 10px 30px;
  }

  button {
    margin-top: 10px;
  }

  .createAccount {
    font-size: 10px;
  }

  .created {
    font-size: 10px;
    padding: 10px;
  }
}

@media screen and (min-width: 471px) and (max-width: 800px) {
  .login-container {
    padding-top: 10px;
  }

  fieldset {
    font-size: 15px;
    padding: 10px 30px;
  }

  button {
    margin-top: 10px;
  }

  .createAccount {
    font-size: 12px;
  }

  .created {
    font-size: 12px;
    padding: 10px;
  }
}
</style>
