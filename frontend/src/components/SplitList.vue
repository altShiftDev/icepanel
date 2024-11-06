<template>
  <div class="q-px-xs" >
    <span v-if="splitData.length === 0" class="absolute-center">Split a transaction first!</span>
    <q-list class="full-height last-child-pad">
      <q-item v-for="z in splitData" :key="z.id" class="q-px-none transaction">
          <q-item-section thumbnail>
            <q-avatar size="20px" rounded class="q-pl-md q-pr-md">
              <img :src="`src/assets/${z.merchant_logo}`">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-dark text-weight-medium">{{ z.merchant_name }}</q-item-label>
            <q-item-label class="text-grey">
              Splitting with: <span class="text-dark text-weight-medium">{{ findSplitterNames(z.members) }}</span>
            </q-item-label> 
          </q-item-section> 
          <q-item-section side>
            <q-item-label v-if="z.payer_id === userStore.user.id" class="text-weight-medium">They owe you <span class="text-green">{{ z.currency === 'GBP' ?  '£' : '$' }}{{ Math.ceil(z.price / z.members.length * 100)/100 }} {{ z.currency === 'CAD' ? '' : z.currency }}</span><span v-if="z.members.length > 2">each</span></q-item-label>
            <q-item-label v-else class="text-weight-medium">You owe {{ findDebtors(z.payer_id) }} <span class="text-red">{{ z.currency === 'GBP' ?  '£' : '$' }}{{ Math.ceil(z.price / z.members.length * 100)/100 }} {{ z.currency === 'CAD' ? '' : z.currency }}</span></q-item-label>
          </q-item-section> 
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
    const splitData = computed(() => userStore.splitData)
    const findSplitterNames = userStore.findSplitterNames
    const findDebtors = userStore.findDebtors
    return { 
      userStore, splitData, findSplitterNames, findDebtors
    }
  }
})
</script>