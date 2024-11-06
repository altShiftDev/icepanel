<template>
  <q-card style="width: 400px" class="custom-border-radius">
    <q-card-section class="row items-center no-wrap q-mt-lg">
      <q-item class="full-width">
          <q-item-section avatar>
            <q-avatar size="40px" rounded>
              <img :src="`src/assets/${userStore.activeTX.merchant_logo}`">
            </q-avatar>
          </q-item-section> 

          <q-item-section>
            <q-item-label >{{ userStore.activeTX.merchant_name }}</q-item-label>
            <q-item-label caption>{{ userStore.activeTX.category }}</q-item-label>
          </q-item-section> 
          <q-item-section side class="text-dark text-weight-medium">
            {{ userStore.activeTX.currency === 'GBP' ?  '£' : '$' }} {{ userStore.activeTX.price }} {{ userStore.activeTX.currency === 'CAD' ? '' : userStore.activeTX.currency }}
          </q-item-section>
      </q-item>
    </q-card-section>
    <q-btn v-if="userStore.txTab === 'split'" @click="userStore.txTab = 'details'" class="absolute absolute-top-left" style="top: 15px; left: 15px" flat size="md" dense icon="arrow_back"></q-btn>
    <q-separator></q-separator>
    <q-tab-panels
      v-model="userStore.txTab"
      animated
      swipeable
      vertical
      transition-prev="slide-right"
      transition-next="slide-left"
      class="shadow-3"
      style="overflow: scroll"
    >
      <q-tab-panel name="details" class="">
        <q-card-section class="row">
          <q-item class="col-12">
            <q-item-section>
              <q-item-label>When</q-item-label>
            </q-item-section> 
            <q-item-section side>
              <q-item-label>{{ formatDate(userStore.activeTX.date_created) }}</q-item-label>
            </q-item-section> 
          </q-item> 
          <q-item class="col-12">
            <q-item-section>
              <q-item-label>Where</q-item-label>
            </q-item-section> 
            <q-item-section side>
              <q-item-label>{{ userStore.activeTX.payment_type === 'POS' ? 'In Person' : 'Online' }}</q-item-label>
            </q-item-section> 
          </q-item> 
          <q-item class="col-12">
            <q-item-section>
              <q-item-label>Note</q-item-label>
            </q-item-section> 
            <q-item-section side>
              <q-item-label class="underline cursor-pointer text-accent">
                <span v-if="!userStore.activeTX.notes || userStore.activeTX.notes === null">add</span>
                <span v-else class="underline">{{ userStore.activeTX.notes }}</span>
                <q-popup-edit v-model="userStore.activeTX.notes" v-slot="scope">
                  <q-input v-model="scope.value" dense outlined autofocus counter color="accent" @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-item-label>
            </q-item-section> 
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <q-item-label>Split</q-item-label>
            </q-item-section> 
            <q-item-section side>
              <q-item-label>{{ userStore.activeTX.split_id ? `splitting with ${userStore.findSplitNamesByID(userStore.activeTX.split_id)}` : 'Not split yet' }}</q-item-label>
            </q-item-section> 
          </q-item> 
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-if="!userStore.activeTX.split_id" color="primary" @click="userStore.txTab = 'split'" no-caps class="">Split this bill</q-btn>
        </q-card-actions>
      </q-tab-panel>
      <q-tab-panel name="split" class="">          
        <q-card-section class="row">
          <q-item v-for="y in userStore.contacts" :id="y.id" class="col-12">
            <q-item-section avatar>
              <q-avatar size="30px" color="primary" text-color="white">
                {{ y.name.split('')[0] }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ y.name }}</q-item-label>
            </q-item-section> 
            <q-item-section side>
              <q-checkbox size="xs" v-model="userStore.selectedContacts" :val="y.id" />
            </q-item-section> 
          </q-item> 
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" no-caps @click="userStore.split(userStore.activeTX, userStore.selectedContacts); userStore.showTX = false; userStore.selectedContacts = []">Confirm Split</q-btn>
        </q-card-actions>
      </q-tab-panel> 
    </q-tab-panels> 
  </q-card>
</template>
<script>
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user.js'
export default defineComponent({
  setup () {
    const userStore = useUserStore()
    const formatDate = userStore.formatDate
    return { 
      userStore, formatDate
    }
  }
})
</script>