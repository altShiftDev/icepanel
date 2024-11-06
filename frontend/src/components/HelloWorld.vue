<template>
  <div class="row">{{ userData }}</div>
  <div>
    <button type="button" class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Hello {{ userData.name }}</button>
    <button @click="logout()" type="button" class="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">logout</button>
  </div>
</template>

<script>
import { defineComponent, computed, onBeforeMount } from 'vue'

import { useUserStore } from '/src/stores/user.js'

export default defineComponent({
  name: 'HelloWorld',
  setup () {
    const userStore = useUserStore()
    // const authStore = useAuthStore()
    const userData = computed(() => userStore.user)

    onBeforeMount(
      userStore.getProfile(),
      userStore.getTransactions(),
      // userStore.getPartnerData(userData.value.partner_id)
    )
    const logout = userStore.logout

    // const campaigns = computed(() => userStore.campaigns)
    // const loadingCampaigns = computed(() => campaigns.value === null)

    return {
      userData,
      logout
      // campaigns,
      // loadingCampaigns
    }
  }
})
</script>