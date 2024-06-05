<script setup>
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from "vue-router";
const router = useRouter()
// 图标导入
import {RefreshOutlined, AccessTimeOutlined} from "@vicons/material";

import Status from '@/components/Status.vue'
import RelatedWord from "@/components/RelatedWord.vue";


const props = defineProps({
  currentWord: String
})
const pageStatus = reactive({
  finding: true,
  found: false
})
const isShowContent = computed(()=>{
  return !pageStatus.finding && pageStatus.found
})
const statusCode = computed(() => {
  if(pageStatus.finding) return 0
  if(!pageStatus.finding && !pageStatus.found) return 1
  return 2
})


const hasGenerated = ref(false)
const wordRootInfo = ref()

import {getGPTExplanation} from "@/api/query.js";
import {getObjectFromString} from "@/api/base.js";
import {useLoadingBar, useDialog} from "naive-ui";

const loadingBar = useLoadingBar()
const dialog = useDialog()

function generateWordRootExplanation(){
  // check config in localStorage
  if(!localStorage.getItem('config')){
    dialog.warning({
      title: '需要设置',
      content: '未找到配置信息，请设置OpenAI相关信息, 否则无法查询词根信息',
      positiveText: '设置',
      negativeText: '暂不设置',
      onPositiveClick: ()=>{
        router.push({
          name: 'Settings'
        })
      },
      onNegativeClick: ()=>{
        pageStatus.finding = false
        pageStatus.found = false
      }
    })
    return
  }
  if(hasGenerated.value) return
  loadingBar.start()
  getGPTExplanation(props.currentWord, 'root')
      .then(res => {
        let raw_data = res.data.choices[0].message.content
        let data = getObjectFromString(raw_data)
        wordRootInfo.value = data
        hasGenerated.value = true
        pageStatus.found = wordRootInfo.value.hasRoot
        pageStatus.finding = false
        loadingBar.finish()
      })
      .catch(e=>{
        pageStatus.finding = false
        pageStatus.found = false
        loadingBar.error()
        console.warn(e)
      })
}

function regenerate(){
  hasGenerated.value = false
  pageStatus.finding = true
  pageStatus.found = false
  generateWordRootExplanation()
}


defineExpose({
  generateWordRootExplanation,
  hasGenerated
})
</script>

<template>
  <n-card size="small" v-if="pageStatus.finding">
    <template #header>
      <n-skeleton text height="32px" width="20%"/>
      <br />
      <n-skeleton text width="40%" />
      <br />
      <n-skeleton text width="90%" />
      <br />
      <n-skeleton text :repeat="2" />
    </template>
  </n-card>
  <n-scrollbar style="max-height: 450px;width: 480px;">
    <n-flex size="small" vertical>
      <n-card size="small" id="word-root" v-if="isShowContent" v-for="item in wordRootInfo.details" :title="item.root">
        <n-text>{{item.rootMeaning}}</n-text>
        <template #footer>
          <n-flex vertical>
            <n-text strong>其他单词</n-text>
            <n-flex>
              <RelatedWord v-for="word in item.relatedWords" :word="word" />
            </n-flex>
          </n-flex>
        </template>
      </n-card>
    </n-flex>
    <n-flex v-if="isShowContent" vertical style="margin-top: 16px;">
      <n-flex v-if="hasGenerated" justify="end">
        <n-button quaternary @click="regenerate">
          <template #icon>
            <n-icon><RefreshOutlined /></n-icon>
          </template>
          重新生成
        </n-button>
      </n-flex>
    </n-flex>
  </n-scrollbar>

</template>
