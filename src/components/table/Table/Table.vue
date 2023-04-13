<template>
    <div class="v-table">
        <div class="ivu-table-quick-filter">
            <Input placeholder="Enter name" style="width: auto">
            <template #prefix>
                <Icon type="ios-search"/>
            </template>
            </Input>
        </div>
        <div :class="wrapClasses" :style="styles" ref="tableWrap">
            <div :class="classes">
                <div :class="[prefixCls + '-title']" v-if="showSlotHeader" ref="title"><slot name="header"></slot></div>
                <div :class="[prefixCls + '-header']" v-if="showHeader" ref="header" @mousewheel="handleMouseWheel">
                    <VTableHead
                        :prefix-cls="prefixCls"
                        :styleObject="tableHeaderStyle"
                        :columns="cloneColumns"
                        :column-rows="columnRows"
                        :obj-data="objData"
                        :columns-width="columnsWidth"
                        :data="rebuildData"></VTableHead>
                </div>
                <div :class="[prefixCls + '-body']" :style="bodyStyle" ref="body" @scroll="handleBodyScroll"
                    v-show="!((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">
                    <table-body
                        ref="tbody"
                        :draggable="draggable"
                        :prefix-cls="prefixCls"
                        :styleObject="tableStyle"
                        :columns="cloneColumns"
                        :data="rebuildData"
                        :row-key="rowKey"
                        :columns-width="columnsWidth"
                        :obj-data="objData"></table-body>
                </div>
                <table-summary
                    v-if="showSummary && (data && data.length)"
                    ref="summary"
                    :prefix-cls="prefixCls"
                    :styleObject="tableStyle"
                    :columns="cloneColumns"
                    :data="summaryData"
                    :columns-width="columnsWidth"
                />
                <div
                    :class="[prefixCls + '-tip']" :style="bodyStyle" @scroll="handleBodyScroll"
                    v-show="((!!localeNoDataText && (!data || data.length === 0)) || (!!localeNoFilteredDataText && (!rebuildData || rebuildData.length === 0)))">
                    <table cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td :style="{'height':bodyStyle.height,'width':`${headerWidth}px`}">
                                    <span v-html="localeNoDataText" v-if="!data || data.length === 0"></span>
                                    <span v-html="localeNoFilteredDataText" v-else></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div :class="fixedTableClasses" :style="fixedTableStyle" v-if="isLeftFixed">
                    <div :class="fixedHeaderClasses" v-if="showHeader">
                        <VTableHead
                            fixed="left"
                            :prefix-cls="prefixCls"
                            :styleObject="fixedTableStyle"
                            :columns="leftFixedColumns"
                            :column-rows="columnRows"
                            :fixed-column-rows="leftFixedColumnRows"
                            :obj-data="objData"
                            :columns-width="columnsWidth"
                            :data="rebuildData"></VTableHead>
                    </div>
                    <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedBody" @mousewheel="handleFixedMousewheel" @DOMMouseScroll="handleFixedMousewheel">
                        <table-body
                            fixed="left"
                            :draggable="draggable"
                            :prefix-cls="prefixCls"
                            :styleObject="fixedTableStyle"
                            :columns="leftFixedColumns"
                            :data="rebuildData"
                            :row-key="rowKey"
                            :columns-width="columnsWidth"
                            :obj-data="objData"></table-body>
                    </div>
                    <table-summary
                        v-if="showSummary && (data && data.length)"
                        fixed="left"
                        :prefix-cls="prefixCls"
                        :styleObject="fixedTableStyle"
                        :columns="leftFixedColumns"
                        :data="summaryData"
                        :columns-width="columnsWidth"
                        :style="{ 'margin-top': showHorizontalScrollBar ? scrollBarWidth + 'px' : 0 }"
                    />
                </div>
                <div :class="fixedRightTableClasses" :style="fixedRightTableStyle" v-if="isRightFixed">
                    <div :class="fixedHeaderClasses" v-if="showHeader">
                        <VTableHead
                            fixed="right"
                            :prefix-cls="prefixCls"
                            :styleObject="fixedRightTableStyle"
                            :columns="rightFixedColumns"
                            :column-rows="columnRows"
                            :fixed-column-rows="rightFixedColumnRows"
                            :obj-data="objData"
                            :columns-width="columnsWidth"
                            :data="rebuildData"></VTableHead>
                    </div>
                    <div :class="[prefixCls + '-fixed-body']" :style="fixedBodyStyle" ref="fixedRightBody" @mousewheel="handleFixedMousewheel" @DOMMouseScroll="handleFixedMousewheel">
                        <table-body
                            fixed="right"
                            :draggable="draggable"
                            :prefix-cls="prefixCls"
                            :styleObject="fixedRightTableStyle"
                            :columns="rightFixedColumns"
                            :data="rebuildData"
                            :row-key="rowKey"
                            :columns-width="columnsWidth"
                            :obj-data="objData"></table-body>
                    </div>
                    <table-summary
                        v-if="showSummary && (data && data.length)"
                        fixed="right"
                        :prefix-cls="prefixCls"
                        :styleObject="fixedRightTableStyle"
                        :columns="rightFixedColumns"
                        :data="summaryData"
                        :columns-width="columnsWidth"
                        :style="{ 'margin-top': showHorizontalScrollBar ? scrollBarWidth + 'px' : 0 }"
                    />
                </div>
                <div :class="[prefixCls + '-fixed-right-header']" :style="fixedRightHeaderStyle" v-if="isRightFixed"></div>
                <div :class="[prefixCls + '-footer']" v-if="showSlotFooter" ref="footer"><slot name="footer"></slot></div>
            </div>
            <div class="ivu-table-resize-line" v-show="showResizeLine" ref="resizeLine"></div>
            <div class="ivu-table-context-menu" :style="contextMenuStyles" v-if="showContextMenu">
                <Dropdown trigger="custom" :visible="contextMenuVisible" transfer @on-click="handleClickDropdownItem" @on-clickoutside="handleClickContextMenuOutside">
                    <template #list>
                        <DropdownMenu>
                            <slot name="contextMenu"></slot>
                        </DropdownMenu>
                    </template>
                </Dropdown>
            </div>
            <Spin fix :show="loading">
                <slot name="loading"></slot>
            </Spin>
        </div>
        <Page :total="400" :size="size" :page-size="pageSize" :model-value="page" show-sizer show-total class="ivu-table-page" @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
    </div>
</template>
<script src="./Table.js"></script>
