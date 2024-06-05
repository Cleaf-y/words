<script setup>
import {ref, reactive, onBeforeMount, onBeforeUnmount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useLoadingBar} from "naive-ui";
import {AccessTimeOutlined} from "@vicons/material";
import {Speaker120Regular} from "@vicons/fluent";
import {getCibaExplanation} from "@/api/query.js";

import WordRoot from "@/components/WordRoot.vue";
import Derives from "@/components/Derives.vue";
import Scenes from "@/components/Scenes.vue";


const wordType = {
  'adv': '副词',
  'phrase': '短语',
  'verb': '动词',
  'n-uncount': '名词-不可数',
  'n-sing': '名词-仅单数',
  'n-count': '名词-可数',
  'n-plural': '名词-仅复数',
  'conj-coord': '连词-并列',
  'conj-subord': '连词-从属',
  'quest': '疑问词',
  'adj-graded': '形容词-可比',
  'adj': '形容词',
  'ord': '序数词',
  'pron': '代词',
  'prep': '介词',
  'n-var': '名词-可变',
  'n-count-coll': '集合名词',
  'n-sing-coll': '集合名词-形单',
}
function getTypeVerbose(originalType) {
  // if originalType in wordType, get the type verbose, else return originalType
  return wordType[originalType] || originalType
}

const route  = useRoute()
const router = useRouter()
const queryInfo = reactive({
  word: ''
})
const pageData = reactive({
  finding: true,
  found: false,
  collins: false
})
const basicExplanation = ref(null)
const collinsExplanation = ref(null)
const phoneticPlayerRef = ref(null)
const loadingBar = useLoadingBar()

const tabWordRootRef = ref(null)


onBeforeMount(async () => {
  loadingBar.start()

  let {word} = route.query
  queryInfo.word = word
  //const data = await getExplanation(word)
  const data = await getCibaExplanation(word)

  const info = data.data.pageProps.initialReduxState.word.wordInfo.baesInfo
  basicExplanation.value = info
  // 如果拿不到collins字段，说明走的是翻译api，没查到词
  if (info.translate_result) {
    pageData.finding = false
    pageData.found = false
    loadingBar.error()
    return
  }
  if (data.data.pageProps.initialReduxState.word.wordInfo.collins) {
    collinsExplanation.value = data.data.pageProps.initialReduxState.word.wordInfo.collins
    pageData.collins = true
  }
  pageData.finding = false
  pageData.found = true
  loadingBar.finish()
})

onBeforeUnmount(()=>{
  if(pageData.finding){
    loadingBar.finish()
  }
})

function backToHome(){
  router.push({
    name: 'Home'
  })
}

function playPhonetic(isBrE){
  if (isBrE) {
    phoneticPlayerRef.value.src = basicExplanation.value.symbols[0].ph_en_mp3
  } else {
    phoneticPlayerRef.value.src = basicExplanation.value.symbols[0].ph_am_mp3
  }
  phoneticPlayerRef.value.play()
}


const tabDict = {
  "词根": tabWordRootRef
}
function onChangeTab(newTabName) {
  if(tabDict[newTabName]){
    tabDict[newTabName].value.generateWordRootExplanation()
  }
}
</script>

<template>
  <audio ref="phoneticPlayerRef"/>
  <n-empty class="tips" v-if="!pageData.finding && !pageData.found" size="huge" description="未找到单词">
    <template #extra>
      <n-button secondary type="primary" size="large" @click="backToHome">返回</n-button>
    </template>
  </n-empty>
  <n-space v-if="!pageData.finding">
    <n-space v-if="pageData.found">
      <n-flex vertical>
        <n-flex id="brief" vertical>
          <n-h1>{{queryInfo.word}}</n-h1>
          <n-rate id="collect" size="small"></n-rate>
        </n-flex>
        <n-scrollbar style="max-height: 350px;">
          <n-flex vertical v-for="symbol in basicExplanation.symbols" id="brief">
            <div id="phonetics">
              <strong>BrE</strong> &nbsp;&nbsp;&nbsp; /{{symbol.ph_en}}/ &nbsp;
              <n-a @click="playPhonetic(true)"><n-icon size="16"><Speaker120Regular /></n-icon></n-a>
              <br/>
              <strong>AmE</strong> &nbsp; /{{symbol.ph_am}}/ &nbsp;
              <n-a @click="playPhonetic(false)"><n-icon size="16"><Speaker120Regular /></n-icon></n-a>
            </div>
            <n-space id="brief-info" v-for="item in symbol.parts">
              <n-text type="success" strong :depth="3">{{item.part}}</n-text>
              <span v-for="meaning in item.means">{{meaning}};</span>
            </n-space>
          </n-flex>
        </n-scrollbar>
      </n-flex>
      <n-flex vertical id="gpt">
        <n-empty id="no-gpt" v-if="!pageData.collins" description="暂无详解"></n-empty>
        <n-tabs v-if="pageData.collins" type="line" animated @update:value="onChangeTab">
          <n-tab-pane name="详解" :key="0">
            <n-space size="small">
              <n-scrollbar style="max-height: 400px;width: 500px;">
                <n-text>共有 <n-text strong type="success">{{collinsExplanation[0].entry.length}}</n-text> 个义项</n-text>
                <n-card class="cards-wrapper"
                        size="small"
                        v-for="(item, index) in collinsExplanation[0].entry"
                        :title="`${index+1}.${item.tran}`">
                  <span v-html="item.def"></span>
                  <template #header-extra>
                    <n-tag size="small" v-if="item.posp" type="success">{{getTypeVerbose(item.posp.toLowerCase())}}</n-tag>
                  </template>
                  <br /><br />
                  <n-collapse v-if="item.example.length > 0">
                    <n-collapse-item title="例句" name="1">
                      <span v-for="e in item.example">
                        <n-text type="success">·&nbsp; {{e.ex}}</n-text>
                        <br />
                        <n-text :depth="3"> &nbsp;&nbsp;&nbsp;{{e.tran}}</n-text>
                        <br />
                      </span>
                    </n-collapse-item>
                  </n-collapse>
                </n-card>
              </n-scrollbar>
            </n-space>
          </n-tab-pane>
          <n-tab-pane display-directive="show" name="词根" :key="1">
            <WordRoot ref="tabWordRootRef" :current-word="queryInfo.word"/>
          </n-tab-pane>
          <n-tab-pane display-directive="show" name="串记" :key="2">
            <Derives :word="queryInfo.word"/>
          </n-tab-pane>
          <n-tab-pane display-directive="show" name="情景" :key="3">
            <Scenes :word="queryInfo.word"/>
          </n-tab-pane>
        </n-tabs>
      </n-flex>
    </n-space>
  </n-space>
  <n-empty class="tips" v-if="pageData.finding" size="huge" description="查询中...">
    <template #icon>
      <n-icon><AccessTimeOutlined /></n-icon>
    </template>
  </n-empty>
</template>

<style scoped lang="scss">
.wrapper {
  height: 100%;
}

.tips {
  margin-top: 128px;
}

.cards-wrapper {
  width: 470px;
  margin-top: 12px;
}

#brief {
  margin-left: 16px;
  padding: 0 16px 16px 32px;
  width: 200px;
}

#gpt {
  width: 500px;
}

#collect {
  margin-bottom: 12px;
}

#phonetics {
  margin-bottom: 8px;
}

#no-gpt {
  margin-top: 150px;
}
</style>
