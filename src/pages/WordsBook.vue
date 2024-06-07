<script setup>
import RelatedWord from '@/components/RelatedWord.vue'
import { ref, onBeforeMount, watch, computed } from 'vue'

const notedWords = ref('')
const wordsList = ref([])

import { getWordsList } from '../database/wordNote';
const pageInfo = ref({
    currentPage: 1,
    pageCount: 1,
    isOrderByTime: false,
    isDesc: true
})
const orderBy = computed(() => {
    return pageInfo.value.isOrderByTime ? 'addTimestamp' : 'importance'
})
const orderByText = computed(() => {
    return pageInfo.value.isOrderByTime ? '按时间排序' : '按重要性排序'
})
function toggleOrderBy() {
    pageInfo.value.isOrderByTime = !pageInfo.value.isOrderByTime
}

const order = computed(() => {
    return pageInfo.value.isDesc ? 'desc' : 'asc'
})
const orderText = computed(() => {
    return pageInfo.value.isDesc ? '降序' : '升序'
})
function toggleOrder() {
    pageInfo.value.isDesc = !pageInfo.value.isDesc
}

onBeforeMount(async () => {
    const words = await getWordsList({
        currentPage: 1
    })
    pageInfo.value.pageCount = words.totalPages
    notedWords.value = words.words
})

const isShowBrief = ref(false)
const btnText = computed(() => {
    return isShowBrief.value ? '隐藏释义' : '显示释义'
})
function toggleBrief() {
    isShowBrief.value = !isShowBrief.value
}


watch(pageInfo, async (newVal) => {
    const options = {
        currentPage: newVal.currentPage,
        sortBy: orderBy.value,
        order: order.value
    }
    console.log(options)
    const words = await getWordsList(options)
    notedWords.value = words.words
}, { deep: true })


import dayjs from 'dayjs'
function getSimpleTime(timeStr) {
    return dayjs(timeStr).format('MM-DD HH:mm')
}
import { getSingleBrief } from '@/api/query.js'
watch(notedWords, async (newVal) => {
    let briefs = newVal.map(async item => {
        let brief = ''
        if (isShowBrief.value) {
            let result = await getSingleBrief(item.word)
            brief = result.data.data.entries[0].explain
        }
        return {
            word: item.word,
            addTimestamp: getSimpleTime(item.addTimestamp),
            importance: item.importance,
            brief
        }
    })
    wordsList.value = await Promise.all(briefs)
})

watch(isShowBrief, async (newVal) => {
    let briefs = notedWords.value.map(async item => {
        let brief = ''
        if (isShowBrief.value) {
            let result = await getSingleBrief(item.word)
            brief = result.data.data.entries[0].explain
        }
        return {
            word: item.word,
            addTimestamp: getSimpleTime(item.addTimestamp),
            importance: item.importance,
            brief
        }
    })
    wordsList.value = await Promise.all(briefs)
})


import { useRouter } from 'vue-router';
const router = useRouter();
function handleClick(event) {
    const item = event.target.closest('li')
    const word = item.getAttribute('data-key')
    router.push({
        name: 'Query',
        query: {
            word
        }
    })
}
</script>

<template>
    <n-flex size="small" vertical style="padding-left: 36px;padding-right: 36px;">
        <n-flex justify="space-between">
            <n-h2>生词本</n-h2>
            <div>
                <n-button quaternary @click="toggleBrief">{{ btnText }}</n-button>
                <n-button quaternary @click="toggleOrderBy">{{ orderByText }}</n-button>
                <n-button quaternary @click="toggleOrder">{{ orderText }}</n-button>
            </div>
        </n-flex>
        <div class="wrapper">
            <n-scrollbar style="max-height: 62vh;">
                <n-flex justify="center">
                    <div class="inner">
                        <n-list clickable hoverable>
                            <n-list-item v-for="item in wordsList" :key="item.word" :data-key="item.word"
                                @click="handleClick">
                                <div class="item">
                                    <n-thing>
                                        <template #header>
                                            <div class="item-title">
                                                <n-flex justify="space-between">
                                                    <n-text strong type="success">{{ item.word }}</n-text>
                                                    <n-rate :value="item.importance" readonly></n-rate>
                                                </n-flex>
                                            </div>
                                        </template>
                                        <template #description>
                                            <n-text :depth="3">{{ item.addTimestamp }}</n-text>
                                        </template>
                                        <n-text v-if="isShowBrief">{{ item.brief }}</n-text>
                                    </n-thing>
                                </div>
                            </n-list-item>
                        </n-list>
                    </div>
                </n-flex>
            </n-scrollbar>
        </div>
        <n-flex justify="end">
            <n-pagination v-model:page="pageInfo.currentPage" :page-count="pageInfo.pageCount" simple />
        </n-flex>
    </n-flex>
</template>

<style scoped lang="scss">
.wrapper {
    width: 90vw;
    height: 65vh;
}

.inner {
    width: 80vw;

    .item {
        width: 80vw;
    }
}

.item-title {
    width: 78vw;
}
</style>
