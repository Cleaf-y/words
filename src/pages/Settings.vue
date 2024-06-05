<script setup>
import {ref, onBeforeMount} from 'vue'

const models = [
  {
    label: 'GPT-3: GPT-3.5 Turbo模型，价格最低',
    value: 'gpt-3.5-turbo-1106'
  },
  {
    label: 'GPT-4: GPT-4 Turbo模型',
    value: 'gpt-4-turbo-2024-04-09'
  },
  {
    label: 'GPT-4o: 最新的GPT-4模型，生成速度更快',
    value: 'gpt-4o-2024-05-13'
  }
]
const configData = ref({
  apiKey: '',
  apiUrl: '',
  selModel: ''
})

onBeforeMount(()=>{
  // try to get config from local storage
  let config = localStorage.getItem('config')
  if(config){
    configData.value = JSON.parse(config)
  }
})

const configFormRules = {
  apiKey: {
    required: true,
    message: '请输入API Key',
    trigger: 'blur'
  },
  apiUrl: {
    required: true,
    message: '请输入API URL',
    trigger: 'blur'
  },
  selModel: {
    required: true,
    message: '请选择要使用的大模型'
  }
}
const configFormRef = ref()
import {useMessage} from "naive-ui";
const message = useMessage()
function saveConfig(e){
  e.preventDefault()
  configFormRef.value.validate(err=>{
    if(!err){
      localStorage.setItem('config', JSON.stringify(configData.value))
      message.success('保存成功')
    } else {
      message.error('错误！请检查配置')
    }
  })
}

import {useDialog} from "naive-ui";
const dialog = useDialog()
function clearConfig(){
  dialog.warning({
    title: '清除配置',
    content: '确定要清除配置吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: ()=>{
      localStorage.removeItem('config')
      configData.value = {
        apiKey: '',
        apiUrl: '',
        selModel: ''
      }
      message.success('清除成功')
    }
  })
}
</script>

<template>
<n-flex class="main-wrapper" vertical>
  <n-h1>OpenAI 参数配置</n-h1>
  <n-form ref="configFormRef" :rules="configFormRules" :model="configData">
    <n-form-item label="API URL" path="apiUrl">
      <n-input v-model:value="configData.apiUrl" placeholder="https://xxx.com/api"></n-input>
    </n-form-item>
    <n-form-item label="API KEY" path="apiKey">
      <n-input v-model:value="configData.apiKey" placeholder="sk-xxxxxx"></n-input>
    </n-form-item>
    <n-form-item label="模型选择" path="selModel">
      <n-select v-model:value="configData.selModel" :options="models" placeholder="选择一个大模型"/>
    </n-form-item>

      <n-form-item>
        <n-space style="width: 700px" justify="space-between">
          <n-button quaternary attr-type="button" @click="clearConfig" type="error">清除</n-button>
          <n-button attr-type="button" @click="saveConfig" :type="'primary'">保存</n-button>
        </n-space>
      </n-form-item>
  </n-form>
</n-flex>
</template>

<style scoped lang="scss">
.main-wrapper {
  padding: 32px 64px 0 64px;

}
</style>
