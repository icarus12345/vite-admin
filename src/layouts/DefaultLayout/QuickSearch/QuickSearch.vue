<template>
  <AutoComplete
    v-model="value4"
    icon="ios-search"
    placeholder="input here"
    style="width: 300px"
  >
    <div class="v-auto-complete-item" v-for="item in data4">
      <div class="v-auto-complete-group">
        <span>{{ item.title }}</span>
        <a>More</a>
      </div>
      <Option
        v-for="option in item.children"
        :value="option.title"
        :key="option.title"
      >
        <span class="v-auto-complete-title">{{ option.title }}</span>
        <span class="v-auto-complete-count"><Numeral :value="option.count" format="0,0.00" /></span>
      </Option>
    </div>
    <a class="v-auto-complete-more">SEE ALL</a>
  </AutoComplete>
</template>
<style lang="less" scoped src="./QuickSearch.less"></style>
<script lang="ts" src='./QuickSearch.ts'></script>