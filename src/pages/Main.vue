<template>
  <n-space vertical justify="center">
    <div class="input-box">
      <n-auto-complete ref="wordInputRef" v-model:value="queryWord" :options="wordOptions"
        :render-label="renderEntryList" size="large" clearable placeholder=" Input your word..." @update:value="onEntry"
        @select="onSelected" @keydown.esc="onEsc" @keydown.enter="onEnter">
        <template #prefix>
          <n-icon>
            <SearchOutlined />
          </n-icon>
        </template>
      </n-auto-complete>
    </div>
    <n-divider />
    <div class="quote-box">
      <n-space vertical>
        <n-space justify="space-between">
          <n-text type="success">每日一句</n-text>
          <n-text :depth="3">{{ todayStr }}</n-text>
        </n-space>
        <n-space justify="center">
          <n-text class="quote">{{ dailyQuote.content }}</n-text>
        </n-space>
        <n-space justify="center">
          <n-text class="trans" :depth="3">{{ dailyQuote.note }}</n-text>
        </n-space>
      </n-space>
    </div>
    <div class="stat-box no-select">
      <n-space justify="center">
        <n-card size="small">
          <n-statistic label="共学习了">
            <n-number-animation :from="0" :to="statisticsInfo.total" />
          </n-statistic>
        </n-card>
        <n-card size="small">
          <n-statistic label="今日已学">
            <n-number-animation :from="0" :to="statisticsInfo.today" />
          </n-statistic>
        </n-card>
        <n-card v-if="false">
          <n-statistic label="待复习单词"> 5 </n-statistic>
        </n-card>
      </n-space>
    </div>
  </n-space>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { getDailyQuote } from "@/api/qoute.js";
import dayjs from "dayjs";
import { SearchOutlined } from "@vicons/antd";

const wordInputRef = ref(null);
const queryWord = ref("");

const dailyQuote = reactive({
  content: "An hour in the morning is worth two in the evening",
  note: "一日之计在于晨",
});
const todayStr = dayjs().format("YYYY-MM-DD");

import { useDialog } from "naive-ui";
const dialog = useDialog();

import { getStatistics } from "../database/statistics";
const statisticsInfo = ref({
  total: 0,
  today: 0
})
onMounted(async () => {
  const dq = await getDailyQuote();
  dailyQuote.content = dq.content;
  dailyQuote.note = dq.note;

  let stats = await getStatistics();
  console.log(stats);
  statisticsInfo.value.total = stats.totalNotes;
  statisticsInfo.value.today = stats.todayCounts;

  wordInputRef.value.focus();

  // check config in localStorage
  if (!localStorage.getItem("config")) {
    dialog.warning({
      title: "需要设置",
      content: "未找到配置信息，请设置OpenAI相关信息",
      positiveText: "设置",
      negativeText: "暂不设置",
      onPositiveClick: () => {
        appRouter.push({
          name: "Settings",
        });
      },
    });
  }
});

import { useRouter } from "vue-router";
const appRouter = useRouter();
function onEnter() {
  if (queryWord.value === "") return;

  appRouter.push({
    name: "Query",
    query: {
      word: queryWord.value,
    },
  });
}

import { getSuggestion } from "@/api/query.js";
const entriesList = ref([]);
const wordOptions = computed(() => {
  if (entriesList.value && entriesList.value.length === 0) {
    return [];
  }
  return entriesList.value.map((item) => {
    // return `${item.entry} ${item.explain}`
    return {
      label: item.entry,
      value: item.entry,
      ex: item.explain,
    };
  });
});

function onEntry(currentEntry) {
  if (currentEntry === "") {
    return;
  }
  getSuggestion(currentEntry).then((res) => {
    if (res.data.result.code === 404) {
      entriesList.value = [];
    } else {
      entriesList.value = res.data.data.entries;
    }
  });
}
function onEsc() {
  queryWord.value = "";
  wordInputRef.value.focus();
}
function onSelected(val) {
  //let queryWord = val.split(' ')[0]
  appRouter.push({
    name: "Query",
    query: {
      word: val,
    },
  });
}

import { NText } from "naive-ui";
function renderEntryList(opt) {
  return h("a", {}, [
    h(
      NText,
      {
        type: "primary",
        strong: true,
      },
      opt.label + " "
    ),
    h(NText, { depth: "3" }, opt.ex),
  ]);
}
</script>

<style lang="scss" scoped>
.input-box {
  margin-top: 64px;
  padding: 0 36px 0 36px;

  .input-item {
    text-align: center;
    justify-content: center;
  }
}

.stat-box {
  margin-top: 16px;
}

.quote-box {
  margin-top: 16px;
  padding: 0 36px 0 36px;
}

.dropdown {
  width: 400px;
}

.trans {
  font-size: 20px;
  font-family: 'KingHwa_OldSong';
}

.quote {
  font-size: 22px;
  font-family: 'Gloock', sans-serif;
}
</style>
