<template>
  <Modal
    v-model="show"
    draggable
    sticky
    scrollable
    :mask="false"
    :fullscreen="fullscreen"
    ok-text="OK"
    cancel-text="Cancel"
    width="768"
    @on-ok="onOk"
    @on-cancel="onCancel"
    @on-visible-change="onVisibleChange"
    class-name="ivu-modal-without-padding">
    <template #header>
      <div class="ivu-modal-header-inner">
        <Icon type="md-arrow-back" size="20"/>
        <Divider type="verticle"></Divider>
        <span>{{ title }}</span>
        <i size="20" class="material-symbols-rounded float-end me-4 cursor-pointer" @click="fullscreen = !fullscreen">{{ fullscreen ? 'close_fullscreen' : 'fullscreen' }}</i>
      </div>
    </template>
    <slot></slot>
  </Modal>
</template>
<script lang="ts" src="./WidgetModal.ts"></script>

<style lang="less" scoped src="./WidgetModal.less"></style>
