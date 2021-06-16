<template>
<div class="dashboard">
  <Scheduler v-if="user" />
  <NeedLogin v-else />
</div>
</template>

<script>
import axios from 'axios';
import Scheduler from '@/components/Scheduler.vue';
import NeedLogin from '@/components/NeedLogin.vue';
export default {
  name: 'dashboard',
  components: {
    Scheduler,
    NeedLogin,
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
    }
  },
}
</script>
