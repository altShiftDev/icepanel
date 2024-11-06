<template>
  <div class="q-px-xs" >
    <span v-if="!txData" class="absolute-center">somebody forgot to seed the db with test data... was it you?</span>
    <q-list class="full-height last-child-pad">
      <q-item v-for="x in txData" :key="x.id" :class="{'sticky tx-month': x.isMonth, 'sticky tx-day': x.isDate}" clickable v-ripple class="q-px-none transaction">
        <template v-if="x.isMonth">
          <q-item-section class="text-dark text-weight-regular text-center">{{ formatDate(x.date, 'MMMM YYYY') }}</q-item-section>
        </template>
        <template v-else-if="x.isDate">
          <q-item-section class="text-dark text-weight-light">{{ formatDate(x.date) }}</q-item-section>
        </template>
        <template v-else>
          <q-item-section @click="userStore.activeTX = x; userStore.showTX = true" avatar>
            <q-avatar size="30px" rounded>
              <img :src="`src/assets/${x.merchant_logo}`">
            </q-avatar>
          </q-item-section> 
          <q-item-section @click="userStore.activeTX = x; userStore.showTX = true" >
            <span class="text-dark text-weight-medium">{{ x.merchant_name }}</span>
          </q-item-section> 
          <q-item-section @click="userStore.activeTX = x; userStore.showTX = true" side class="text-dark text-weight-medium">{{ x.currency === 'GBP' ?  '£' : '$' }} {{ x.price }} {{ x.currency === 'CAD' ? '' : x.currency }}</q-item-section>
        </template>
      </q-item>
    </q-list> 
  </div>

</template>
<script>
import { defineComponent, computed } from 'vue'
import { useUserStore } from '@/stores/user.js'
export default defineComponent({
  setup () {

    const userStore = useUserStore()
    const formatDate = userStore.formatDate
    const txData = computed(() => userStore.transactions)
    return { 
      userStore, txData, formatDate
    }
  }
})
</script>