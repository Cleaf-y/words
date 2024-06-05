<script setup>
import RelatedWord from "@/components/RelatedWord.vue";
import Status from "@/components/Status.vue";

import {ref} from 'vue'

const props = defineProps({
  word: String
})

const explanation = ref()
const pageData = ref({
  finding: true,
  found: false
})
const statusCode = computed(() => {
  if(pageData.value.finding) return 0
  if(!pageData.value.finding && !pageData.value.found) return 1
  return 2
})


import {getCibaExplanation} from "@/api/query.js";
onBeforeMount(async ()=>{
  try {
    const result = await getCibaExplanation(props.word)
    const cibaInfo = result.data.pageProps.initialReduxState.word.wordInfo
    explanation.value = cibaInfo
  } catch (e) {
    console.warn(e)
    pageData.value.finding = false
    pageData.value.found = false
    return
  }
  if(explanation.value.synonym || explanation.value.antonym || explanation.phrase){
    pageData.value.found = true
  }
  pageData.value.finding = false
})
</script>

<template>
  <Status v-if="statusCode!==2" :status="statusCode"/>
  <n-scrollbar style="max-height: 400px;width: 500px;">
    <n-flex v-if="statusCode===2" vertical id="wrapper">
      <div>
        <n-flex v-if="explanation.synonym">
          <n-card size="small" v-for="item in explanation.synonym" title="同近义词">
            <template #header-extra>
              <n-text strong type="success">{{item.part_name || '其他'}}</n-text>
            </template>
            <template #default>
              <n-collapse>
                <n-collapse-item v-for="m in item.means" :title="m.word_mean">
                  <n-flex>
                    <RelatedWord v-for="word in m.cis" :word="word" />
                  </n-flex>
                </n-collapse-item>
              </n-collapse>
            </template>
          </n-card>
        </n-flex>
      </div>

      <n-flex v-if="explanation.antonym">
        <n-card size="small" v-for="item in explanation.antonym" title="反义词">
          <template #header-extra>
            <n-text strong type="success">{{item.part_name || '其他'}}</n-text>
          </template>
          <template #default>
            <n-collapse>
              <n-collapse-item v-for="m in item.means" :title="m.word_mean">
                <n-flex>
                  <RelatedWord v-for="word in m.cis" :word="word" />
                </n-flex>
              </n-collapse-item>
            </n-collapse>
          </template>
        </n-card>
      </n-flex>

      <n-flex v-if="explanation.sameAnalysis">
        <n-card size="small" v-for="item in explanation.sameAnalysis" title="易混辨析">
          <template #default>
            <n-collapse>
              <n-collapse-item :title="item.part_name">
                <n-space vertical>
                  <n-space vertical v-for="m in item.means">
                    <n-text strong type="success">{{m.split(' ：')[0]}}</n-text>
                    <n-text :depth="3">{{m.split(' ：')[1]}}</n-text>
                  </n-space>
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </template>
          <template #footer>
            <n-flex>
              <RelatedWord v-for="word in item.word_list.split(', ')" :word="word" />
            </n-flex>
          </template>
        </n-card>
      </n-flex>
    </n-flex>
  </n-scrollbar>
</template>

<style lang="scss" scoped>
#wrapper {
  width: 470px;
}
</style>
