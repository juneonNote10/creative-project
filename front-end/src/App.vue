<template>
  <div id="app">
    <div id="nav">
      <div v-if="user">
        <router-link to="/dashboard"><i class="fa fa-user-circle"></i></router-link>
      </div>
      <div v-else>
        <router-link to="/dashboard"><i class="fa fa-sign-in-alt"></i></router-link>
      </div>
      <router-link to="/">Home</router-link>
      <router-link to="/upload">Upload</router-link>
      <router-link to="/schedule">Schedule</router-link>
    </div>
    <div v-if="user">
      <div id="menu">
        <h1>{{user.firstName}} {{user.lastName}} <a @click="logout"><i class="fas fa-sign-out-alt"></i></a></h1>
      </div>
    </div>
    <div id="divideLine1" />
    <router-view id="content" />

    <div id="divideLine2" />
    <div id="footer">
      <div id="git-link">GitHub Repository: <a href="https://github.com/juneonNote10/creative-project">https://github.com/juneonNote10/creative-project</a></div>
      <p>Hour spent: 125 hours</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        document.getElementById('divideLine1').style.marginTop = '1.5%';
        window.location.reload();
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style>
body {
  font-family: 'Noto Sans JP', sans-serif;
}

#app {
  margin-left: 6%;
  margin-right: 1%;
}

#nav {
  height: 100%;
  width: 5%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #2C0035;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#nav:hover {
  width: 10%;
}

#nav a {
  text-align: center;
  text-decoration: none;
  font-size: 120%;
  transition: 0.2s;
  margin: 30px 0;
  color: white;
  width: 100%;
}

#nav a.router-link-exact-active {
  color: #008FCD;
}

::placeholder {
  font-style: italic;
  color: #CFCFCF;
}

label {
  color: #575757;
}

#menu {
  text-align: right;
  color: #2C0035;
}

#menu h1 {
  font-size: 20px;
}

#divideLine1 {
  color: #2C0035;
  border-bottom: 3px solid #2C0035;
  margin-bottom: 1.5%;
  margin-top: 1.5%;
}

.error {
  background-color: #C54E4A;
  color: white;
  text-align: center;
  font-size: 20px;
  padding: 15px;
  border-radius: 15px;
}

#divideLine2 {
  color: #2C0035;
  border-bottom: 3px solid #2C0035;
  margin-bottom: 1.5%;
  margin-top: 1.5%;
}

#footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90px;
  background: #2C0035;
  font-size: 15px;
  color: #ffffff;
  margin: 30px 0px;
}

#footer a {
  color: #ffffff;
}

#footer a:hover {
  color: #BFBFBF;
}

@media screen and (max-width: 470px) {
  #nav {
    width: 5%;
  }

  #nav:hover {
    width: 15%;
  }

  #nav a {
    font-size: 50%;
  }

  #menu h1 {
    font-size: 10px;
  }

  .error {
    font-size: 10px;
    padding: 10px;
  }

  #divideLine1 {
    margin-bottom: 5%;
  }

  #footer {
    height: 50px;
    font-size: 9px;
  }

  #divideLine2 {
    margin-top: 5%;
  }
}

@media screen and (min-width: 471px) and (max-width: 1000px) {
  #nav {
    width: 5%;
  }

  #nav:hover {
    width: 15%;
  }

  #nav a {
    font-size: 50%;
  }

  #menu h1 {
    font-size: 15px;
  }

  .error {
    font-size: 15px;
    padding: 15px;
  }

  #divideLine1 {
    margin-bottom: 2%;
  }

  #footer {
    height: 80px;
    font-size: 12px;
  }

  #divideLine2 {
    margin-top: 5%;
  }

}

@media screen and (min-width: 1001px) and (max-width: 1200px) {
  #nav {
    width: 5%;
  }

  #nav:hover {
    width: 15%;
  }

  #nav a {
    font-size: 70%;
  }

  #menu h1 {
    font-size: 20px;
  }

  .error {
    font-size: 15px;
    padding: 15px;
  }

  #divideLine1 {
    margin-bottom: 2%;
  }

  #footer {
    height: 80px;
    font-size: 12px;
  }

  #divideLine2 {
    margin-top: 5%;
  }

}

@media screen and (min-width: 1201px) and (max-width: 1500px) {
  #nav a {
    font-size: 80%;
  }
}

@media screen and (min-width: 1501px) and (max-width: 1700px) {
  #nav a {
    font-size: 100%;
  }
}
</style>
