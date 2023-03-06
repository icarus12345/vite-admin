<template>
  <Modal v-model="show" draggable sticky scrollable :mask="false" ok-text="OK" cancel-text="Cancel" width="600" @on-ok="onOk" @on-cancel="onCancel" @on-visible-change="onVisibleChange">
    <template #header>
      <div class="ivu-modal-header-inner">
        <Icon type="md-arrow-back" size="20"/>
        <Divider type="verticle"></Divider>
        <span>{{ title }}</span>
      </div>
    </template>
    <slot></slot>
  </Modal>
</template>
<script lang="ts" src="./WidgetModal.ts"></script>

<style lang="less" scoped src="./WidgetModal.less"></style>
