<template>
    <Table ref="selection" 
      :columns="columns" 
      :data="data" 
      :loading="loading"
      height="320" size="small"
      fixed-shadow="auto"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-contextmenu="handleContextMenu"
      context-menu
      show-context-menu>
        <template #title="{ row }">
            <div v-line-clamp="2">{{ row.title }}</div>
        </template>
        <template #user="{ row }">
            <strong>{{ row.user.name }}</strong>
            <div>{{ row.user.email }}</div>
        </template>
        <template #status="{ row }">
            <Checkbox v-model="row.completed" border></Checkbox>
        </template>
      <template #contextMenu>
        <DropdownItem><Icon type="md-add" size="16"/> Add New</DropdownItem>
        <DropdownItem @click="handleContextMenuEdit"><Icon type="md-create" size="16"/> Edit</DropdownItem>
        <DropdownItem @click="handleContextMenuDelete"><Icon type="md-trash" size="16"/> Delete</DropdownItem>
      </template>
      <template #action="{ row, index }">
        <Dropdown placement="bottom-end" :transfer="true" trigger="click">
            <Button type="text" icon="ios-more" size="small"></Button>
            <template #list>
                <DropdownMenu>
                    <DropdownItem>Add</DropdownItem>
                    <DropdownItem>Edit</DropdownItem>
                    <DropdownItem disabled>Private</DropdownItem>
                    <DropdownItem>Publish</DropdownItem>
                    <DropdownItem divided>Remove</DropdownItem>
                </DropdownMenu>
            </template>
        </Dropdown>
      </template>
    </Table>

    <Page :total="400" size="small" show-sizer show-total class="ivu-table-page" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"/>
</template>
<script lang="ts" src="./TaskList.ts"></script>

<style lang="less" scoped src="./TaskList.less"></style>