<template>
  <q-page style="max-width: 600px" class="q-px-md row relative">
    <!-- <div class="col-12 row ">
      <div class="full-width q-mb-md">
        <q-input outlined color="primary" label="email" v-model="email"/>
      </div>
      <div class="full-width">
        <q-btn color="primary" @click="login()" class="full-width" label="Send Magic Link"/>
      </div>
    </div> -->

    <div class="absolute absolute-top-middle">
      <svg height="100px" viewBox="0 0 269 269" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>AltShiftDev Logo</title>
        <defs/>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="altShiftDev-Logo-Final" transform="translate(134.500000, 134.500000) scale(-1, 1) translate(-134.500000, -134.500000) " fill="#232F3E">
                <path d="M172.573771,0 L172.573771,59.0873824 C168.394788,53.1696164 159.688575,47.9480581 148.544621,47.9480581 L108.14779,47.9480581 C79.9396583,47.9480581 58,70.5748106 58,98.7712252 L58,171.176833 C58,199.373248 80.6361554,222 108.844287,222 L191.727441,222 C197.995915,222 202.871394,217.126546 202.871394,210.860676 L202.871394,0 L269,0 L269,204 C269,239.898509 239.898509,269 204,269 L0,269 L0,65 C-4.39629938e-15,29.1014913 29.1014913,6.59444907e-15 65,0 L172.573771,0 Z M88.1606253,97.3901199 C88.1606253,85.9026917 97.2150874,76.8519907 108.707289,76.8519907 L155.720843,76.8519907 C164.427056,77.8963024 171.740276,85.2064839 172.436773,94.6052888 L172.436773,189.637649 C172.436773,191.726272 170.69553,193.118688 168.606039,193.118688 L108.707289,193.118688 C97.2150874,193.118688 88.1606253,184.067987 88.1606253,172.580559 L88.1606253,97.3901199 Z" id="symbol" transform="translate(134.500000, 134.500000) scale(-1, 1) translate(-134.500000, -134.500000) "/>
            </g>
        </g>
      </svg>
    </div>
    <div class="absolute col-12 row items-center justify-start credit-card-div relative" style="top: 30%">
      <img class="credit-card group-card group-card-top absolute" style="height: 130px" src="/src/assets/creditcard-simple.svg" >
      <img class="credit-card group-card group-card-middle absolute" style="height: 130px" src="/src/assets/creditcard-simple.svg" >
      <img class="credit-card group-card group-card-bottom absolute" style="height: 150px" src="/src/assets/creditcard-complex.svg" >
    </div>
    <div class="absolute col-12 row items-center justify-start cursor-default relative" style="top: 55%">
      <div class="col-12 row text-h4" style="line-height: 1;">Easy</div>
      <div class="col-12 row text-h4" style="line-height: 1;">Simple</div>
      <div class="col-12 row text-h4" style="line-height: 1;">Banking</div>
    </div>
    <div class="full-width row justify-center items-end" style="height: 90vh">
      <div class="full-width row justify-center">
        <q-btn @click="getStarted = !getStarted" color="primary" class="full-width" label="Get Started"/>
        <div class="text-dark text-center q-pt-sm text-weight-thin">
          By continuing you agree to our 
          <span class="cursor-pointer underline">
            terms of service 
          </span>}
        </div>
      </div>
    </div>
    <q-dialog v-model="getStarted" position="bottom">
      <q-card style="width: 400px" class="custom-border-radius">
        <q-card-section class="row items-center no-wrap q-mt-lg">
          <div class="col-12 text-h2 text-center" style="font-size: 1.6rem;">Let's get started.</div>
        </q-card-section>  
        <q-card-section class="row items-center no-wrap">
          <div class="col-12">
            <div class="full-width q-mb-lg relative">
              <div class="text-dark q-mb-sm text-subtitle1" style="font-size: 0.8rem;">What's your name?</div>
              <q-input dense outlined color="primary" placeholder="Scott Ross" v-model="name"/>
              <div class="absolute text-red-9 q-mb-sm text-caption" style="font-size: 0.6rem;">{{ nameErr }}</div>
            </div>
            <div class="full-width q-mb-lg relative">
              <div class="text-dark q-mb-sm text-subtitle1" style="font-size: 0.8rem;">What's your email?</div>
              <q-input dense outlined color="primary" placeholder="dev@altshiftdev.com" v-model="email"/>
              <div class="absolute text-red-9 q-mb-sm text-caption" style="font-size: 0.6rem;">{{ emailErr }}</div>
            </div>
            <div class="full-width q-my-xl">
              <q-btn color="primary" @click="login()" class="full-width" label="Send Magic Link"/>
            </div>
          </div>
          <q-space />

        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'

import { useUserStore } from '/src/stores/user.js'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'LoginPage',
  setup () {
    const userStore = useUserStore()
    // const authStore = useAuthStore()
    // const userData = computed(() => authStore.user)

    const name = import.meta.env.PROD ? ref('') : ref('Scott Ross')
    const nameErr = ref('')
    const email = import.meta.env.PROD ? ref('') : ref('magic-test@altshiftdev.com')
    const emailErr = ref('')

    onBeforeMount(() =>
      userStore.testAuth()
    )
    async function login () {
      if (!name.value.trim()) nameErr.value = 'Please put in your full name'
      else nameErr.value = ''
      if (!email.value.trim()) emailErr.value = 'Something about that email doesn\'t look right...'
      else emailErr.value = ''
      if (nameErr.value || emailErr.value) return
      const success = await userStore.authenticate(name.value, email.value)
      if (success.status === 200) Notify.create({
        message: 'Email Sent',
        icon: 'announcement'
      })
      else Notify.create({
        message: 'Something\'s wrong with the backend',
        icon: 'warning'
      })
    }
    const getStarted = ref(false)
    return {
      name,
      email,
      nameErr,
      emailErr,
      getStarted,
      login
    }
  }
})
</script>
<style lang="scss">
.group-card {
  height: 120px;
  // opacity: 0.5;
}
.group-card-top {
  left: -110px;
  rotate: -35deg;
  opacity: 0.9;
  top: 30px;
}
.group-card-middle {
  left: -60px;
  rotate: -15deg;
  opacity: 0.9;
  top: 40px;
}
.group-card-bottom {
  left: -30px;
  rotate: -5deg;
  top: 80px;
}
.absolute-top-middle {
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.custom-border-radius {
  border-radius: 30px 30px 0 0 !important;
}
</style>