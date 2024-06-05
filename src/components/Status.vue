<script setup>
import {AccessTimeOutlined, ErrorOutlineOutlined} from "@vicons/material";

const props = defineProps({
  status: Number
})

const statusMap = {
  0: '查询中',
  1: '无内容'
}
</script>

<template>
<n-empty id="tips" :description="statusMap[props.status]" size="huge">
  <template #icon>
    <n-icon v-if="props.status === 0"><AccessTimeOutlined /></n-icon>
    <n-icon v-if="props.status === 1"><ErrorOutlineOutlined /></n-icon>
  </template>
</n-empty>
</template>

<style scoped lang="scss">
#tips {
  margin-top: 150px;
}
</style>
