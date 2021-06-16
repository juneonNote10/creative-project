<template>
<div class="upload">
  <Uploader v-if="user" />
  <NeedLogin v-else />
</div>
</template>

<script>
import axios from 'axios';
import Uploader from '@/components/Uploader.vue';
import NeedLogin from '@/components/NeedLogin.vue';
export default {
  name: 'Upload',
  components: {
    Uploader,
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
