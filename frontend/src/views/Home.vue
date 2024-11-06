<template>
  <q-page style="max-width: 600px" class="q-px-md">
    <account-header :logout="logout"/>
    <q-tabs
        v-model="userStore.tab"
        class="bg-white shadow-2"
      >
        <q-tab name="tx" no-caps label="Transactions" content-class="text-dark"/>
        <q-tab name="dt" no-caps label="Splits" content-class="text-dark"/>
    </q-tabs>
    <q-tab-panels v-model="userStore.tab" animated swipeable transition-prev="slide-right" transition-next="slide-left" class="shadow-3" style="height: calc(50vh - 50px); overflow: scroll">
      <q-tab-panel name="tx" class="">
        <transaction-list/>
      </q-tab-panel>
      <q-tab-panel name="dt" >
        <split-list/>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="userStore.showTX" position="bottom">
      <transaction-viewer/>
    </q-dialog>
  </q-page>
</template>


<script>
import { defineComponent, ref, watch, computed, onBeforeMount } from 'vue'
import {storeToRefs} from 'pinia'
import { useUserStore } from '@/stores/user.js'
import AccountHeader from '@/components/AccountHeader.vue'
import TransactionList from '@/components/TransactionList.vue'
import SplitList from '../components/SplitList.vue'
import TransactionViewer from '../components/TransactionViewer.vue'


export default defineComponent({
  name: 'HomePage',
  components: { AccountHeader, TransactionList, SplitList, TransactionViewer },
  setup () {
    const userStore = useUserStore()
    const { activeTX, showTX } = storeToRefs(userStore)

    onBeforeMount(() =>
      userStore.getProfile()
    )
    const logout = userStore.logout

    watch(showTX, (newVal) => {
      if (!newVal) {
        userStore.activeTX = {}
        userStore.txTab = 'details'
        userStore.selectedContacts = []
      }
      else userStore.originalNotes = JSON.parse(JSON.stringify(newVal.notes || null))
    }, { deep: true })

    watch(activeTX, (newVal, oldVal) => {
      if (!newVal.id) return
      if (oldVal.notes && userStore.originalNotes !== newVal.notes) userStore.updateNote(newVal)
    }, { deep: true })

    return {
      userStore,
      logout
    }
  }
})
</script>
<style lang="scss">
.sticky:first-child {
  padding: 12px 0 0 0;
}
.transaction {}
  .sticky {
    top: 0;
    background: #FFF;
    position: sticky;
    max-height: 14px;
    padding: 12px 0 10px 0;
    min-height: 10px;
  }
    .tx-day {
      padding-top: 28px !important;
      z-index: 9;
    }
    .tx-month {
      z-index: 10;
    }
.transaction:last-child {
  margin-bottom: 30px;
}
</style>