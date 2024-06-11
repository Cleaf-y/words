<script setup>
import { ref } from 'vue'
import {getGPTExplanation} from "@/api/query.js";
import {getObjectFromString} from "@/api/base.js";

import Status from '@/components/Status.vue'

const treeData = ref([])
const pageStatus = reactive({
  isLoading: false,
  isFound: false
})

const props = defineProps({
  word: String
})

async function getTreeResult() {
  pageStatus.isLoading = true
  let result = await getGPTExplanation(props.word, 'tree')
  console.log(result)
  console.log(result.data.choices[0].message.content)
  result = getObjectFromString(result.data.choices[0].message.content)
  treeData.value = [result]
  console.log('@', treeData.value)
  pageStatus.isLoading = false
}
</script>

<template>
  <div v-if="!pageStatus.isFound">
    <n-space justify="end">
      <n-button quaternary type="primary" :loading="pageStatus.isLoading" :disabled="pageStatus.isLoading" @click="getTreeResult">生成</n-button>
    </n-space>
    <n-scrollbar style="max-height: 400px;">
      <n-space justify="center">
        <Status v-if="treeData.length === 0" :status="1"/>
        <TreeItem v-if="treeData.length > 0" :node="treeData[0]" :isRoot="true"/>
      </n-space>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">

</style>
