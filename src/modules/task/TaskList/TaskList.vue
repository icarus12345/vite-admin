<template>
  <VTable ref="selection" 
    :columns="columns" 
    :loading="loading"
    :source="data"
    size="small"
    fixed-shadow="auto"
    @on-sort-change="sortChange"
    @on-filter-change="filterChange"
    @on-contextmenu="contextMenu"
    @on-selection-change="selectionChange"
    context-menu
    show-context-menu>
    <template #title="{ row }">
      <div v-line-clamp="2">{{ row.title }}</div>
    </template>
    <template #user="{ row }">
      <div>{{ row.user.name }}</div>
      <small>{{ row.user.email }}</small>
    </template>
    <template #completed="{ row }">
      <Switch size="small" v-model="row.completed" class="pe-none"/>
    </template>
    <template #contextMenu>
      <DropdownItem><Icon type="md-add" size="16"/> Add New</DropdownItem>
      <DropdownItem @click="contextMenuEdit"><Icon type="md-create" size="16"/> Edit</DropdownItem>
      <DropdownItem @click="contextMenuDelete"><Icon type="md-trash" size="16"/> Delete</DropdownItem>
    </template>
  </VTable>
</template>
<script lang="ts" src="./TaskList.ts"></script>

<style lang="less" scoped src="./TaskList.less"></style>