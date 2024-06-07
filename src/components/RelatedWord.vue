<script setup>
import { ref } from 'vue'

const props = defineProps({
  word: String
})

const found = ref(false)
const explanation = ref(null)

import { getSingleBrief } from "@/api/query.js";

const isShowTips = ref(false)
async function onMouseOver() {
  if (!found.value) {
    try {
      let result = await getSingleBrief(props.word)
      explanation.value = result.data.data.entries[0]
      found.value = true
    } catch (e) {
      console.warn(e)
    }
  }
  isShowTips.value = true
}
function onMouseLeave() {
  isShowTips.value = false
}


import { useRouter } from "vue-router";
const router = useRouter()
function navigateToWord() {
  router.push({
    name: 'Query',
    query: {
      word: props.word
    }
  })
}
</script>

<template>
<n-popover trigger="manual" :show="isShowTips" placement="bottom">
  <template #trigger>
    <n-button
        text
        @click="navigateToWord"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave">{{props.word}}</n-button>
  </template>
  <template #header><n-text type="success" strong>{{explanation.entry}}</n-text></template>
  <template #default><n-flex style="width: 280px;"><n-text>{{explanation.explain}}</n-text></n-flex></template>
</n-popover>
</template>
