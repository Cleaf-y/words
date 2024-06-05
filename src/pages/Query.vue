<script setup>
import {ref, reactive, onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useLoadingBar} from "naive-ui";
import {AccessTimeOutlined} from "@vicons/material";
import {Speaker120Regular} from "@vicons/fluent";
import {getExplanation, getCibaExplanation} from "@/api/query.js";


const route  = useRoute()
const router = useRouter()
const queryInfo = reactive({
  word: ''
})
const pageData = reactive({
  finding: true,
  found: false
})
const basicExplanation = ref(null)
const collinsExplanation = ref(null)
const phoneticPlayerRef = ref(null)
const loadingBar = useLoadingBar()

function getWordQuery(word) {
  return ''
}

onBeforeMount(async () => {
  loadingBar.start()

  let {word} = route.query
  queryInfo.word = word
  //const data = await getExplanation(word)
  const data = await getCibaExplanation(word)

  const info = data.data.pageProps.initialReduxState.word.wordInfo.baesInfo
  console.log(info)
  basicExplanation.value = info
  collinsExplanation.value = data.data.pageProps.initialReduxState.word.wordInfo.collins
  pageData.finding = false
  pageData.found = true
  loadingBar.finish()
})

const gptItems = [
  {
    key: 'derivative',
    label: '派生词'
  },
  {
    key: 'root',
    label: '词根'
  },
]

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
</script>

<template>
  <audio ref="phoneticPlayerRef"/>
  <n-empty class="tips" v-if="!pageData.finding && !pageData.found" size="huge" description="未找到单词">
    <template #extra>
      <n-button @click="backToHome">返回</n-button>
    </template>
  </n-empty>
  <n-space v-if="!pageData.finding">
    <n-space v-if="pageData.found">
      <n-flex vertical id="brief">
        <n-h1>{{queryInfo.word}}</n-h1>
        <div>
          <strong>BrE</strong> &nbsp; /{{basicExplanation.symbols[0].ph_en}}/ &nbsp;
          <n-a @click="playPhonetic(true)"><n-icon size="16"><Speaker120Regular /></n-icon></n-a>
          <br/>
          <strong>AmE</strong> &nbsp; /{{basicExplanation.symbols[0].ph_am}}/ &nbsp;
          <n-a @click="playPhonetic(false)"><n-icon size="16"><Speaker120Regular /></n-icon></n-a>
        </div>
        <n-space v-for="item in basicExplanation.symbols[0].parts">
          <n-text type="success" strong :depth="3">{{item.part}}</n-text>
          <span v-for="meaning in item.means">{{meaning}};</span>
        </n-space>
      </n-flex>
      <n-flex vertical id="gpt">
        <n-tabs type="line" animated>
          <n-tab-pane name="详解">
            <n-space>
              <n-scrollbar style="max-height: 400px;width: 480px;">
                <n-card class="cards-wrapper"
                        v-for="(item, index) in collinsExplanation[0].entry"
                        :title="`${index+1}.${item.tran}`">
                  <span v-html="item.def"></span>
                  <template #header-extra>
                    <n-tag type="success">{{item.posp.toLowerCase()}}</n-tag>
                  </template>
                  <br /><br />
                  <n-collapse>
                    <n-collapse-item title="例句" name="1">
                      <span v-for="e in item.example">
                        <n-text type="success">·&nbsp; {{e.ex}}</n-text>
                        <br />
                        <n-text :depth="3"> &nbsp;&nbsp;{{e.tran}}</n-text>
                        <br />
                        <br />
                      </span>
                    </n-collapse-item>
                  </n-collapse>
                </n-card>
              </n-scrollbar>
            </n-space>
          </n-tab-pane>
          <n-tab-pane v-for="item in gptItems" :name="item.label">
            some content
          </n-tab-pane>
          <n-tab-pane name="情景例句">

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
  width: 450px;
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
</style>