<script setup>
import RelatedWord from '@/components/RelatedWord.vue'

const props = defineProps(
    {
      node: Object,
    }
)
</script>

<template>
  <div class="tree-node">
    <div class="node-content">
      <div>
        <div class="node-line"></div>
        <n-flex>
          <n-tag type="primary">
            <RelatedWord :word="props.node.word" :show-pop="false" />
          </n-tag>
          <div>{{props.node.trans_cn}}</div>
        </n-flex>
      </div>
    </div>
    <div v-if="props.node.children" class="node-children">
      <TreeItem v-for="(child, index) in props.node.children" :key="index" :node="child" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-node {
  margin-left: 40px;
  margin-bottom: 8px;
}

.node-content {
  padding: 8px;
  display: inline-block;
}

.node-children {
  margin-left: 32px;
  border-left: 1px solid #4fc09a;
}

.node-line {
  position: relative;
  top: 16px;
  left: -42px;
  width: 36px;
  height: 1px;
  border-top: 1px solid #4fc09a;
}
</style>

