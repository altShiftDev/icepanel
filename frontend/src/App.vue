<template>
  <q-layout style="max-height: 100vh; overflow: hidden" class="bg-white">
    <q-bar class="q-px-md bg-white">
      <div class="text-weight-medium" :class="{'text-red': screenWidth < 370 || screenWidth > 432 }">{{ fakeClock }}</div>
      <q-space />
      <q-icon name="signal_cellular_alt" />
      <q-icon name="wifi" />
      <q-icon name="battery_full" class="rotate-90" />
    </q-bar>
    <q-page-container>
      <template v-if="screenWidth < 370 || screenWidth > 432">
        <div class="absolute absolute-center text-caption">
          <div class="q-mb-lg text-center text-h2">Hey!</div>
          <div class="">
            Your viewport is too {{ screenWidth < 370 ? 'narrow' : 'wide' }}, so my app is going to look like shit.<br><br> Resize your browser width to at {{ screenWidth < 370 ? ' least 370px' : ' most 432px' }} to continue.
            <br><br>Hint: Use the clock!
          </div>
        </div>
      </template>
      <RouterView v-else />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { RouterView } from 'vue-router'
import { Screen } from 'quasar'
export default defineComponent({
  setup () {
    const fakeClock = computed(() => {
      let arr = screenWidth.value.toString().split('')
      return `${arr[arr.length - 4] || 0 }${arr[arr.length - 3]}:${arr[arr.length - 2]}${arr[arr.length - 1]}`
    })
    const screenWidth = computed(() => Screen.width)
    return { 
      screenWidth, fakeClock 
    }
  }
})
</script>