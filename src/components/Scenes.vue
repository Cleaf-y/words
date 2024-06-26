<script setup>
import {MessageOutlined, PersonOutlineOutlined, RefreshOutlined} from "@vicons/material";
import {NewspaperRegular} from "@vicons/fa";

import { ref } from 'vue'
const isGenerating = ref(false)
const props = defineProps({
  word: String
})

import {getGPTExplanation} from "@/api/query.js";
import {getObjectFromString} from "@/api/base.js";
import {useMessage} from "naive-ui";
const message = useMessage()
const examples = ref([])
async function generateSceneExamples(scene){
  isGenerating.value = true
  try {
    let result = await getGPTExplanation(props.word, scene)
    let res_examples = getObjectFromString(result.data.choices[0].message.content)
    res_examples.examples.forEach(item => {
      examples.value.unshift(item)
    })
    message.success('已生成新的例句')
  } catch (e) {
    message.error(`生成失败: ${e}`, {
      duration: 5000
    })
    console.warn(e)
  }
  isGenerating.value = false
}

</script>

<template>
  <n-flex vertical>
    <n-flex justify="end" size="small">
      <n-button quaternary :disabled="isGenerating" @click="generateSceneExamples('scene')">
        <template #icon>
          <n-icon>
            <RefreshOutlined />
          </n-icon>
        </template>
        随机生成
      </n-button>
      <n-button quaternary :disabled="isGenerating" @click="generateSceneExamples('dialog')">
        <template #icon>
          <n-icon>
            <MessageOutlined />
          </n-icon>
        </template>
        对话
      </n-button>
      <n-button quaternary :disabled="isGenerating" @click="generateSceneExamples('formal')">
        <template #icon>
          <n-icon>
            <NewspaperRegular />
          </n-icon>
        </template>
        书面
      </n-button>
    </n-flex>
    <n-empty v-if="examples.length === 0 && !isGenerating" description="暂无例句，快去生成吧" style="margin-top: 96px;"></n-empty>
    <n-scrollbar style="max-height: 400px;width: 500px;">
      <n-flex vertical style="width: 470px;">
        <n-card v-if="isGenerating" id="skeleton">
          <n-skeleton width="20%"/>
          <n-skeleton width="40%"/>
          <n-skeleton width="90%"/>
          <n-skeleton width="90%"/>
        </n-card>
        <n-card size="small" v-for="item in examples" :title="item.scene_desc">
          <template #header-extra>
            <n-tag v-if="item.isFormal" size="small" type="info">正式</n-tag>
            <n-tag v-if="!item.isFormal" size="small" type="primary">口语</n-tag>
          </template>
          <template #default v-if="item.isFormal">
            <n-flex vertical>
              <n-text type="info">{{item.example.content}}</n-text>
              <n-text :depth="3">{{item.example.trans_cn}}</n-text>
            </n-flex>
          </template>
          <template #default v-if="!item.isFormal">
            <n-flex vertical>
              <n-card size="small" v-for="s in item.example" vertical>
                <template #header>
                  <n-flex align="center" size="small">
                    <n-icon> <PersonOutlineOutlined /> </n-icon>
                    <n-text strong>{{s.speaker}}</n-text>
                  </n-flex>
                </template>
                <n-flex size="small">
                  <n-text strong type="success">{{s.sentence.content}}</n-text>
                  <n-text :depth="3">{{s.sentence.trans_cn}}</n-text>
                </n-flex>
              </n-card>
            </n-flex>
          </template>
        </n-card>
      </n-flex>
    </n-scrollbar>
  </n-flex>
</template>

<style scoped lang="scss">
#skeleton {
  * {
    margin-top: 4px;
  }
}
</style>
