<template>
  <div class="row justify-center items-start" style="height: 50vh">
    <div class="col-12 row justify-between text-center q-mt-md text-subtitle2"> 
      <div>
        <q-btn
          @click="logout()"
          alt="log out"
          size="xs" padding="none"
          round flat
        >
        <q-avatar size="35px">
          <img src="/src/assets/jacob.jpg">
        </q-avatar>
      </q-btn>
      </div>
      <span>Checking</span>   
      <div>
        <q-btn
        size="12px"
        round
        outline
        color="white"
        text-color="primary"
        icon="notifications"
        />
      </div>
    </div>
    <div class="col-12 text-center">
      <div class="text-weight-medium text-h5">$ 11,458.33 </div>
      <span class="text-weight-thin text-dark-grey">Current balance</span>
    </div>
    <credit-cards />
  </div>
</template>

<script>
import CreditCards from '@/components/CreditCards.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccountHeader',
  props: { logout: Function },
  components: { CreditCards }
})
</script>