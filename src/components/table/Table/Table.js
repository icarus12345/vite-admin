import { getCurrentInstance, nextTick } from 'vue';
import VTableHead from '../TableHead/TableHead.vue';
import tableBody from 'view-ui-plus/src/components/table/table-body.vue';
import tableSummary from 'view-ui-plus/src/components/table/summary.vue';
import { Dropdown, DropdownMenu, Spin, Button, ButtonGroup } from 'view-ui-plus';
import { oneOf, getStyle, deepCopy } from 'view-ui-plus/src/utils/assist';
import random from 'view-ui-plus/src/utils/random_str';
import Csv from 'view-ui-plus/src/utils/csv';
import ExportCsv from 'view-ui-plus/src/components/table';
import Locale from 'view-ui-plus/src/mixins/locale';
import elementResizeDetectorMaker from 'element-resize-detector';
import { getAllColumns, convertToRows, convertColumnOrder, getRandomStr } from 'view-ui-plus/src/components/table/util';
import LD, { isObject, isArray } from 'lodash';
import { getScrollBarSize } from '@/utils'
import { DataAdapter } from '@/services'
import { Selection } from '@/utils';

const prefixCls = 'ivu-table';

let rowKey = 1;
let columnKey = 1;



export default {
    name: 'VTable',
    mixins: [ Locale ],
    components: { VTableHead, tableBody, tableSummary, Spin, Dropdown, DropdownMenu, ButtonGroup, Button },
    emits: ['on-current-change', 'on-row-click', 'on-row-dblclick', 'on-contextmenu', 'on-select', 'on-select-cancel', 'on-selection-change', 'on-expand', 'on-expand-tree', 'on-select-all', 'on-select-all-cancel', 'on-sort-change', 'on-filter-change', 'on-drag-drop', 'on-cell-click', 'on-column-width-resize'],
    provide () {
        return {
            TableInstance: this
        };
    },
    inject: {
        TabsInstance: {
            default: null
        },
        ModalInstance: {
            default: null
        },
        DrawerInstance: {
            default: null
        }
    },
    props: {
        // data: {
        //     type: Array,
        //     default () {
        //         return [];
        //     }
        // },
        source: {
            type: Object || Array,
            default () {
                return {
                    url: '',
                    beforeSend: (xhr, settings) => {},
                    beforeLoadComplete: (records) => {},
                    formatData: (data) => {}
                }
            }
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        size: {
            validator (value) {
                return oneOf(value, ['small', 'large', 'default']);
            },
            default () {
                const global = getCurrentInstance().appContext.config.globalProperties;
                return !global.$VIEWUI || global.$VIEWUI.size === '' ? 'default' : global.$VIEWUI.size;
            }
        },
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        // 3.4.0
        maxHeight: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default () {
                return '';
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        draggable: {
            type: Boolean,
            default: false
        },
        tooltipTheme: {
            validator (value) {
                return oneOf(value, ['dark', 'light']);
            },
            default: 'dark'
        },
        // 4.5.0
        tooltipMaxWidth: {
            type: Number,
            default: 300
        },
        // #5380 开启后，:key 强制更新，否则使用 index
        // 4.1 开始支持 String，指定具体字段
        rowKey: {
            type: [Boolean, String],
            default: false
        },
        // 4.0.0
        spanMethod: {
            type: Function
        },
        // 4.0.0
        showSummary: {
            type: Boolean,
            default: false
        },
        // 4.0.0
        summaryMethod: {
            type: Function
        },
        // 4.0.0
        sumText: {
            type: String
        },
        // 4.1.0
        indentSize: {
            type: Number,
            default: 16
        },
        // 4.1.0
        loadData: {
            type: Function
        },
        // 4.4.0
        updateShowChildren: {
            type: Boolean,
            default: false
        },
        // 4.1.0
        contextMenu: {
            type: Boolean,
            default: false
        },
        // 4.2.0
        showContextMenu: {
            type: Boolean,
            default: false
        },
        // 4.7.0
        fixedShadow: {
            validator (value) {
                return oneOf(value, ['auto', 'show', 'hide']);
            },
            default: 'show'
        },
        autoCloseContextmenu: {
            type: Boolean,
            default: true
        }
    },
    data () {
        const colsWithId = this.makeColumnsId(this.columns);
        return {
            keyword: '',
            page: 1,
            pageSize: 20,
            pageSizeOpts: [10, 20, 50, 100, 200, 500],
            totalRecords: 0,
            data: [],
            ready: false,
            tableWidth: 0,
            tableHeight: 0,
            columnsWidth: {},
            prefixCls: prefixCls,
            compiledUids: [],
            objData: this.makeObjData(),     // checkbox or highlight-row
            rebuildData: [],    // for sort or filter
            cloneColumns: this.makeColumns(colsWithId),
            columnRows: this.makeColumnRows(false, colsWithId),
            leftFixedColumnRows: this.makeColumnRows('left', colsWithId),
            rightFixedColumnRows: this.makeColumnRows('right', colsWithId),
            allColumns: getAllColumns(colsWithId),  // for multiple table-head, get columns that have no children
            showSlotHeader: true,
            showSlotFooter: true,
            bodyHeight: 0,
            scrollBarWidth: getScrollBarSize(),
            currentContext: this.context,
            cloneData: deepCopy(this.data),    // when Cell has a button to delete row data, clickCurrentRow will throw an error, so clone a data
            showVerticalScrollBar:false,
            showHorizontalScrollBar:false,
            headerWidth:0,
            headerHeight:0,
            showResizeLine: false,
            contextMenuVisible: false,
            contextMenuStyles: {
                top: 0,
                left: 0
            },
            scrollOnTheLeft: false,
            scrollOnTheRight: false,
            id: random(6),
            columnsState: {},
            dataAdapter: new DataAdapter(this.source),
            selection: new Selection(),
            resizeObserver: new ResizeObserver(([entry]) => {
                this.tableHeight = entry.contentRect.height - 48 - 40; // content height - quick filter - paging
                this.handleResize();
            })
        };
    },
    computed: {
        localeNoDataText () {
            if (this.noDataText === undefined) {
                return this.t('i.table.noDataText');
            } else {
                return this.noDataText;
            }
        },
        localeNoFilteredDataText () {
            if (this.noFilteredDataText === undefined) {
                return this.t('i.table.noFilteredDataText');
            } else {
                return this.noFilteredDataText;
            }
        },
        localeSumText () {
            if (this.sumText === undefined) {
                return this.t('i.table.sumText');
            } else {
                return this.sumText;
            }
        },
        wrapClasses () {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-hide`]: !this.ready,
                    [`${prefixCls}-with-header`]: this.showSlotHeader,
                    [`${prefixCls}-with-footer`]: this.showSlotFooter,
                    [`${prefixCls}-with-summary`]: this.showSummary,
                    [`${prefixCls}-wrapper-with-border`]: this.border
                }
            ];
        },
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-${this.size}`]: !!this.size,
                    [`${prefixCls}-border`]: this.border,
                    [`${prefixCls}-stripe`]: this.stripe,
                    [`${prefixCls}-with-fixed-top`]: !!this.tableHeight
                }
            ];
        },
        fixedTableClasses () {
            return [
                `${prefixCls}-fixed`,
                {
                    [`${prefixCls}-fixed-shadow`]: this.fixedShadow === 'show' || (this.fixedShadow === 'auto' && !this.scrollOnTheLeft)
                }
            ];
        },
        fixedRightTableClasses () {
            return [
                `${prefixCls}-fixed-right`,
                {
                    [`${prefixCls}-fixed-shadow`]: this.fixedShadow === 'show' || (this.fixedShadow === 'auto' && !this.scrollOnTheRight)
                }
            ];
        },
        fixedHeaderClasses () {
            return [
                `${prefixCls}-fixed-header`,
                {
                    [`${prefixCls}-fixed-header-with-empty`]: !this.rebuildData.length
                }
            ];
        },
        styles () {
            let style = {};
            let summaryHeight = 0;
            if (this.showSummary) {
                if (this.size === 'small') summaryHeight = 40;
                else if (this.size === 'large') summaryHeight = 60;
                else summaryHeight = 48;
            }
            if (this.tableHeight) {
                let height = parseInt(this.tableHeight) + summaryHeight;
                style.height = `${height}px`;
            }
            if (this.maxHeight) {
                const maxHeight = parseInt(this.maxHeight) + summaryHeight;
                style.maxHeight = `${maxHeight}px`;
            }
            if (this.width) style.width = `${this.width}px`;
            return style;
        },
        tableStyle () {
            let style = {};
            if (this.tableWidth !== 0) {
                let width = '';
                if (this.bodyHeight === 0) {
                    width = this.tableWidth;
                } else {
                    width = this.tableWidth - (this.showVerticalScrollBar?this.scrollBarWidth:0);
                }
//                    const width = this.bodyHeight === 0 ? this.tableWidth : this.tableWidth - this.scrollBarWidth;
                style.width = `${width}px`;
            }
            return style;
        },
        tableHeaderStyle () {
            let style = {};
            if (this.tableWidth !== 0) {
                let width = '';
                width = this.tableWidth;
                style.width = `${width}px`;
            }
            return style;
        },
        fixedTableStyle () {
            let style = {};
            let width = 0;
            this.leftFixedColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'left') width += col._width;
            });
            style.width = `${width}px`;
            return style;
        },
        fixedRightTableStyle () {
            let style = {};
            let width = 0;
            this.rightFixedColumns.forEach((col) => {
                if (col.fixed && col.fixed === 'right') width += col._width;
            });
            //width += this.scrollBarWidth;
            style.width = `${width}px`;
            style.right = `${this.showVerticalScrollBar?this.scrollBarWidth:0}px`;
            return style;
        },
        fixedRightHeaderStyle () {
            let style = {};
            let width = 0;
            let height = this.headerHeight+1;
            if(this.showVerticalScrollBar){
                width = this.scrollBarWidth;
            }
            style.width = `${width}px`;
            style.height = `${height}px`;
            return style;
        },
        bodyStyle () {
            let style = {};
            if (this.bodyHeight !== 0) {
                const height = this.bodyHeight;
                if (this.tableHeight) {
                    style.height = `${height}px`;
                } else if (this.maxHeight) {
                    style.maxHeight = `${height}px`;
                }
            }
            return style;
        },
        fixedBodyStyle () {
            let style = {};
            if (this.bodyHeight !== 0) {
                let height = this.bodyHeight - (this.showHorizontalScrollBar?this.scrollBarWidth:0);
                const bodyHeight = this.showHorizontalScrollBar ? `${height}px` : `${height - 1}px`;
                if (this.tableHeight) style.height = bodyHeight;
                else if (this.maxHeight) style.maxHeight = bodyHeight;
            }
            return style;
        },
        leftFixedColumns () {
            return convertColumnOrder(this.cloneColumns, 'left');
        },
        rightFixedColumns () {
            return convertColumnOrder(this.cloneColumns, 'right');
        },
        isLeftFixed () {
            return this.columns.some(col => col.fixed && col.fixed === 'left');
        },
        isRightFixed () {
            return this.columns.some(col => col.fixed && col.fixed === 'right');
        },
        // for summary data
        summaryData () {
            if (!this.showSummary) return {};

            let sums = {};
            if (this.summaryMethod) {
                sums = this.summaryMethod({ columns: this.cloneColumns, data: this.rebuildData });
            } else {
                this.cloneColumns.forEach((column, index) => {
                    const key = column.key;
                    if (index === 0) {
                        sums[key] = {
                            key: column.key,
                            value: this.localeSumText
                        };
                        return;
                    }
                    const values = this.rebuildData.map(item => Number(item[column.key]));
                    const precisions = [];
                    let notNumber = true;
                    values.forEach(value => {
                        if (!isNaN(value)) {
                            notNumber = false;
                            let decimal = ('' + value).split('.')[1];
                            precisions.push(decimal ? decimal.length : 0);
                        }
                    });
                    const precision = Math.max.apply(null, precisions);
                    if (!notNumber) {
                        const currentValue = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[key] = {
                            key: column.key,
                            value: currentValue
                        };
                    } else {
                        sums[key] = {
                            key: column.key,
                            value: ''
                        };
                    }
                });
            }

            return sums;
        },
        sortBy() {
            return LD.chain(this.columnsState)
                .omitBy((state, key) => {
                    return !state.sortType;
                })
                .map((state, key) => ({column: key, dir: state.sortType }))
                .value()
        },
        filterConditions() {
            return LD.chain(this.columnsState)
                .omitBy((state, key) => {
                    return !state.isFiltered;
                })
                .map((state, key) => state.filterValue.map(d => [key,d[0],d[1]]))
                .flatten()
                .filter(d => ['NULL', 'NOT_NULL'].includes(d[1]) || d[2])
                .value()
        },
        bindingSetting() {
            return {
                keyword: this.keyword,
                page: this.page,
                pageSize: this.pageSize,
                filters: this.filterConditions,
                sorts: this.sortBy
            }
        }
    },
    methods: {
        rowClsName (index) {
            return this.rowClassName(this.data[index], index);
        },
        handleResize () {
                //let tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
            let tableWidth = this.$el.offsetWidth - 1;
            let columnsWidth = {};
            let sumMinWidth = 0;
            let hasWidthColumns = [];
            let noWidthColumns = [];
            let maxWidthColumns = [];
            let noMaxWidthColumns = [];
            this.cloneColumns.forEach((col) => {
                if (col.width) {
                    hasWidthColumns.push(col);
                }
                else{
                    noWidthColumns.push(col);
                    if (col.minWidth) {
                        sumMinWidth += col.minWidth;
                    }
                    if (col.maxWidth) {
                        maxWidthColumns.push(col);
                    }
                    else {
                        noMaxWidthColumns.push(col);
                    }
                }
                col._width = null;
            });


            let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((a, b) => a + b, 0);
            let usableWidth = tableWidth - unUsableWidth - sumMinWidth - (this.showVerticalScrollBar?this.scrollBarWidth:0) - 1;
            let usableLength = noWidthColumns.length;
            let columnWidth = 0;
            if(usableWidth > 0 && usableLength > 0){
                columnWidth = parseInt(usableWidth / usableLength);
            }


            for (let i = 0; i < this.cloneColumns.length; i++) {
                const column = this.cloneColumns[i];
                let width = columnWidth + (column.minWidth?column.minWidth:0);
                if(column.width){
                    width = column.width;
                }
                else{
                    if (column._width) {
                        width = column._width;
                    }
                    else {
                        if (column.minWidth > width){
                            width = column.minWidth;
                        }
                        else if (column.maxWidth < width){
                            width = column.maxWidth;
                        }

                        if (usableWidth>0) {
                            usableWidth -= width - (column.minWidth?column.minWidth:0);
                            usableLength--;
                            if (usableLength > 0) {
                                columnWidth = parseInt(usableWidth / usableLength);
                            }
                            else {
                                columnWidth = 0;
                            }
                        }
                        else{
                            columnWidth = 0;
                        }
                    }
                }

                column._width = width;

                columnsWidth[column._index] = {
                    width: width
                };

            }
            if(usableWidth>0) {
                usableLength = noMaxWidthColumns.length;
                columnWidth = parseInt(usableWidth / usableLength);
                for (let i = 0; i < noMaxWidthColumns.length; i++) {
                    const column = noMaxWidthColumns[i];
                    let width = column._width + columnWidth;
                    if (usableLength > 1) {
                        usableLength--;
                        usableWidth -= columnWidth;
                        columnWidth = parseInt(usableWidth / usableLength);
                    }
                    else {
                        columnWidth = 0;
                    }

                    column._width = width;

                    columnsWidth[column._index] = {
                        width: width
                    };

                }
            }

            this.tableWidth = this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b, 0) + (this.showVerticalScrollBar?this.scrollBarWidth:0) + 1;
            this.columnsWidth = columnsWidth;
            this.fixedHeader();

            // 4.7.0 auto fixed shadow
            if (this.fixedShadow === 'auto') {
                nextTick(() => {
                    const $body = this.$refs.body;
                    this.scrollOnTheLeft = $body.scrollLeft === 0;
                    this.scrollOnTheRight = $body.scrollWidth === $body.scrollLeft + $body.clientWidth;
                });
            }
        },
        handleMouseIn (_index, rowKey) {
            if (this.disabledHover) return;
            const objData = rowKey ? this.getDataByRowKey(rowKey) : this.objData[_index];
            if (objData._isHover) return;
            objData._isHover = true;
        },
        handleMouseOut (_index, rowKey) {
            if (this.disabledHover) return;
            const objData = rowKey ? this.getDataByRowKey(rowKey) : this.objData[_index];
            objData._isHover = false;
        },
        // 通用处理 highlightCurrentRow 和 clearCurrentRow
        handleCurrentRow (type, _index, rowKey) {
            const objData = rowKey ? this.getDataByRowKey(rowKey) : this.objData[_index];

            let oldData = null;
            let oldIndex = -1;

            for (let i in this.objData) {
                if (this.objData[i]._isHighlight) {
                    oldIndex = parseInt(i);
                    this.objData[i]._isHighlight = false;
                    break;
                } else if (this.objData[i].children && this.objData[i].children.length) {
                    const resetData = this.handleResetChildrenRow(this.objData[i]);
                    if (resetData) oldData = JSON.parse(JSON.stringify(resetData));
                }
            }
            if (type === 'highlight') objData._isHighlight = true;
            if (oldIndex >= 0) {
                oldData = JSON.parse(JSON.stringify(this.cloneData[oldIndex]));
            }
            const newData = type === 'highlight' ? rowKey ? JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey))) : JSON.parse(JSON.stringify(this.cloneData[_index])) : null;
            this.$emit('on-current-change', newData, oldData);
        },
        handleResetChildrenRow (objData) {
            let data = null;
            if (objData.children && objData.children.length) {
                for (let i = 0; i < objData.children.length; i++) {
                    const item = objData.children[i];
                    if (item._isHighlight) {
                        item._isHighlight = false;
                        data = item;
                        break;
                    } else if (item.children && item.children.length) {
                        data = this.handleResetChildrenRow(item);
                    }
                }
            }
            return data;
        },
        highlightCurrentRow (_index, rowKey) {
            const objData = rowKey ? this.getDataByRowKey(rowKey) : this.objData[_index];
            if (!this.highlightRow || objData._isHighlight) return;
            this.handleCurrentRow('highlight', _index, rowKey);
        },
        clearCurrentRow () {
            if (!this.highlightRow) return;
            this.handleCurrentRow('clear');
        },
        clickCurrentRow (_index, rowKey) {
            this.highlightCurrentRow (_index, rowKey);
            if (rowKey) {
                this.$emit('on-row-click', JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey))));
            } else {
                this.$emit('on-row-click', JSON.parse(JSON.stringify(this.cloneData[_index])), _index);
            }
        },
        dblclickCurrentRow (_index, rowKey) {
            this.highlightCurrentRow (_index, rowKey);
            if (rowKey) {
                this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey))));
            } else {
                this.$emit('on-row-dblclick', JSON.parse(JSON.stringify(this.cloneData[_index])), _index);
            }
        },
        contextmenuCurrentRow (_index, rowKey, event) {
            if (this.contextMenuVisible) this.handleClickContextMenuOutside();
            nextTick(() => {
                const $TableWrap = this.$refs.tableWrap;
                const TableBounding = $TableWrap.getBoundingClientRect();
                const position = {
                    left: `${event.clientX - TableBounding.left}px`,
                    top: `${event.clientY - TableBounding.top}px`
                };
                this.contextMenuStyles = position;
                this.contextMenuVisible = true;

                if (rowKey) {
                    this.$emit('on-contextmenu', JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey))), event, position);
                } else {
                    this.$emit('on-contextmenu', JSON.parse(JSON.stringify(this.cloneData[_index])), event, position);
                }
            });
        },
        getSelection () {
            // 分别拿根数据和子数据的已选项
            let selectionIndexes = [];
            let selectionRowKeys = [];
            for (let i in this.objData) {
                const objData = this.objData[i];
                if (objData._isChecked) selectionIndexes.push(parseInt(i));
                if (objData.children && objData.children.length) {
                    selectionRowKeys = selectionRowKeys.concat(this.getSelectionChildrenRowKeys(objData, selectionRowKeys));
                }
            }

            // 去重的 RowKeys
            selectionRowKeys = [...new Set(selectionRowKeys)];

            let selection = [];

            this.data.forEach((item, index) => {
                if (selectionIndexes.indexOf(index) > -1) {
                    selection = selection.concat(item);
                }
                if (item.children && item.children.length && selectionRowKeys.length) {
                    selection = selection.concat(this.getSelectionChildren(item, selection, selectionRowKeys));
                }
            });


            selection = [...new Set(selection)];
            return JSON.parse(JSON.stringify(selection));
        },
        getSelectionChildrenRowKeys (objData, selectionRowKeys) {
            if (objData.children && objData.children.length) {
                objData.children.forEach(item => {
                    if (item._isChecked) selectionRowKeys.push(item._rowKey);
                    if (item.children && item.children.length) {
                        selectionRowKeys = selectionRowKeys.concat(this.getSelectionChildrenRowKeys(item, selectionRowKeys));
                    }
                });
            }
            return selectionRowKeys;
        },
        getSelectionChildren (data, selection, selectionRowKeys) {
            if (data.children && data.children.length) {
                data.children.forEach(item => {
                    if (selectionRowKeys.indexOf(item[this.rowKey]) > -1) {
                        selection = selection.concat(item);
                    }
                    if (item.children && item.children.length) {
                        selection = selection.concat(this.getSelectionChildren(item, selection, selectionRowKeys));
                    }
                });
            }
            return selection;
        },
        toggleSelect (_index, rowKey) {
            let data = {};

            if (rowKey) {
                data = this.getDataByRowKey(rowKey);
            } else {
                for (let i in this.objData) {
                    if (parseInt(i) === _index) {
                        data = this.objData[i];
                        break;
                    }
                }
            }
            const status = !data._isChecked;

            data._isChecked = status;
            const selection = this.getSelection();
            console.log(selection,'selection')
            const selectedData = rowKey ? this.getBaseDataByRowKey(rowKey, this.data) : this.data[_index];
            this.$emit(status ? 'on-select' : 'on-select-cancel', selection, JSON.parse(JSON.stringify(selectedData)));
            this.$emit('on-selection-change', selection);
        },
        toggleExpand (_index) {
            let data = {};

            for (let i in this.objData) {
                if (parseInt(i) === _index) {
                    data = this.objData[i];
                    break;
                }
            }
            const status = !data._isExpanded;
            this.objData[_index]._isExpanded = status;
            this.$emit('on-expand', JSON.parse(JSON.stringify(this.cloneData[_index])), status);

            if(this.tableHeight || this.maxHeight){
                nextTick(()=>this.fixedBody());
            }
        },
        toggleTree (rowKey) {
            const data = this.getDataByRowKey(rowKey);
            // async loading
            if ('_loading' in data && data._loading) return;
            if ('_loading' in data && !data._loading && data.children.length === 0) {
                const sourceData = this.getBaseDataByRowKey(rowKey, this.data);
                sourceData._loading = true;
                this.loadData(sourceData, children => {
                    sourceData._loading = false;
                    if (children.length) {
                        sourceData.children = children;
                        nextTick(() => {
                            const newData = this.getDataByRowKey(rowKey);
                            newData._isShowChildren = !newData._isShowChildren;
                            // 由于 updateDataStatus 是基于原数据修改，导致单选、多选等状态重置，所以暂不处理 _showChildren 状态，而是通过事件 @on-expand-tree
                            // 异步时，需设置 _showChildren，否则嵌套子集展开，会自动收起父级
                            this.updateDataStatus(rowKey, '_showChildren', newData._isShowChildren);
                        });
                    }
                });
                return;
            }

            data._isShowChildren = !data._isShowChildren;
            // 由于 updateDataStatus 是基于原数据修改，导致单选、多选等状态重置，所以暂不处理 _showChildren 状态，而是通过事件 @on-expand-tree
            // #675，增加 updateShowChildren
            if (this.updateShowChildren) this.updateDataStatus(rowKey, '_showChildren', data._isShowChildren);
            this.$emit('on-expand-tree', rowKey, data._isShowChildren);
        },
        /**
         * @description 当修改某内置属性，如 _isShowChildren 时，因当将原 data 对应 _showChildren 也修改，否则修改 data 时，状态会重置
         * @param rowKey rowKey
         * @param key 原数据对应的字段
         * @param value 修改的值
         * */
        // todo 单选、多选等状态可能也需要更新原数据
        updateDataStatus (rowKey, key, value) {
            const data = this.getBaseDataByRowKey(rowKey, this.data);
            data[key] = value;
        },
        getDataByRowKey (rowKey, objData = this.objData) {
            let data = null;
            for (let i in objData) {
                const thisData = objData[i];
                if (thisData._rowKey === rowKey) {
                    data = thisData;
                    break;
                } else if (thisData.children && thisData.children.length) {
                    data = this.getChildrenByRowKey(rowKey, thisData);
                    if (data) {
                        break;
                    }
                }
            }
            return data;
        },
        getChildrenByRowKey (rowKey, objData) {
            let data = null;
            if (objData.children && objData.children.length) {
                for (let i = 0; i < objData.children.length; i++) {
                    const item = objData.children[i];
                    if (item._rowKey === rowKey) {
                        data = item;
                        break;
                    } else if (item.children && item.children.length) {
                        data = this.getChildrenByRowKey(rowKey, item);
                        if (data) {
                            break;
                        }
                    }
                }
            }
            return data;
        },
        getBaseDataByRowKey (rowKey, sourceData = this.cloneData) {
            let data = null;
            for (let i = 0; i < sourceData.length; i++) {
                const thisData = sourceData[i];
                if (thisData[this.rowKey] === rowKey) {
                    data = thisData;
                    break;
                } else if (thisData.children && thisData.children.length) {
                    data = this.getChildrenDataByRowKey(rowKey, thisData);
                    if (data && data[this.rowKey] === rowKey) return data;
                }
            }
            return data;
        },
        getChildrenDataByRowKey (rowKey, cloneData) {
            let data = null;
            if (cloneData.children && cloneData.children.length) {
                for (let i = 0; i < cloneData.children.length; i++) {
                    const item = cloneData.children[i];
                    if (item[this.rowKey] === rowKey) {
                        data = item;
                        break;
                    } else if (item.children && item.children.length) {
                        data = this.getChildrenDataByRowKey(rowKey, item);
                        if (data) {
                            break;
                        }
                    }
                }
            }
            return data;
        },
        selectAll (status) {
            const checkedIds = LD.chain(this.getSelection()).map('id').value();
            // this.rebuildData.forEach((data) => {
            //     if(this.objData[data._index]._isDisabled){
            //         this.objData[data._index]._isChecked = false;
            //     }else{
            //         this.objData[data._index]._isChecked = status;
            //     }

            // });
            for (const data of this.rebuildData) {
                const objData = this.objData[data._index];
                if (!objData._isDisabled) {
                    objData._isChecked = status;
                }
                if (data.children && data.children.length) {
                    this.selectAllChildren(objData, status);
                }
            }
            const selection = this.getSelection();
            const ids = LD.chain(selection).map('id').value();
            
            if (status) {
                this.$emit('on-select-all', selection);
                this.selection.select(...ids);
            } else {
                this.selection.deselect(...checkedIds);
                this.$emit('on-select-all-cancel', selection);
            }
            console.log(selection,'selection')
            this.$emit('on-selection-change', selection);
        },
        selectAllChildren (data, status) {
            if (data.children && data.children.length) {
                const ids = LD.chain(data.children).map('id').value();
                if (status) {
                    this.selection.select(...ids);
                } else {
                    this.selection.deselect(...ids);
                }
                data.children.map(item => {
                    if (!item._isDisabled) {
                        item._isChecked = status;
                    }
                    if (item.children && item.children.length) {
                        this.selectAllChildren(item, status);
                    }
                });
            }
        },
        fixedHeader () {
            if (this.tableHeight || this.maxHeight) {
                nextTick(() => {
                    const titleHeight = parseInt(getStyle(this.$refs.title, 'height')) || 0;
                    const headerHeight = parseInt(getStyle(this.$refs.header, 'height')) || 0;
                    const footerHeight = parseInt(getStyle(this.$refs.footer, 'height')) || 0;
                    if (this.tableHeight) {
                        this.bodyHeight = this.tableHeight - titleHeight - headerHeight - footerHeight;
                    } else if (this.maxHeight) {
                        this.bodyHeight = this.maxHeight - titleHeight - headerHeight - footerHeight;
                    }
                    nextTick(()=>this.fixedBody());
                });
            } else {
                this.bodyHeight = 0;
                nextTick(()=>this.fixedBody());
            }
        },
        fixedBody (){
            if (this.$refs.header) {
                this.headerWidth = this.$refs.header.children[0].offsetWidth;
                this.headerHeight = this.$refs.header.children[0].offsetHeight;
                //this.showHorizontalScrollBar = this.headerWidth>this.$refs.header.offsetWidth;
            }

            if (!this.$refs.tbody || !this.data || this.data.length === 0) {
                this.showVerticalScrollBar = false;
            }
            else{
                let bodyContentEl = this.$refs.tbody.$el;
                let bodyEl = bodyContentEl.parentElement;
                let bodyContentHeight = bodyContentEl.offsetHeight;
                let bodyHeight = bodyEl.offsetHeight;

                this.showHorizontalScrollBar = bodyEl.offsetWidth < bodyContentEl.offsetWidth + (this.showVerticalScrollBar?this.scrollBarWidth:0);
                this.showVerticalScrollBar = this.bodyHeight? bodyHeight - (this.showHorizontalScrollBar?this.scrollBarWidth:0) < bodyContentHeight : false;

                if(this.showVerticalScrollBar){
                    bodyEl.classList.add(this.prefixCls +'-overflowY');
                }else{
                    bodyEl.classList.remove(this.prefixCls +'-overflowY');
                }
                if(this.showHorizontalScrollBar){
                    bodyEl.classList.add(this.prefixCls +'-overflowX');
                }else{
                    bodyEl.classList.remove(this.prefixCls +'-overflowX');
                }
            }
        },

        hideColumnFilter () {
            this.cloneColumns.forEach((col) => col._filterVisible = false);
        },
        handleBodyScroll (event) {
            // 4.7.0
            this.scrollOnTheLeft = event.target.scrollLeft === 0;
            this.scrollOnTheRight = event.target.scrollWidth === event.target.scrollLeft + event.target.clientWidth;

            if (this.showHeader) this.$refs.header.scrollLeft = event.target.scrollLeft;
            if (this.isLeftFixed) this.$refs.fixedBody.scrollTop = event.target.scrollTop;
            if (this.isRightFixed) this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
            if (this.showSummary && this.$refs.summary) this.$refs.summary.$el.scrollLeft = event.target.scrollLeft;
            this.hideColumnFilter();
        },
        handleFixedMousewheel(event) {
            let deltaY = event.deltaY;
            if(!deltaY && event.detail){
                deltaY = event.detail * 40;
            }
            if(!deltaY && event.wheelDeltaY){
                deltaY = -event.wheelDeltaY;
            }
            if(!deltaY && event.wheelDelta){
                deltaY = -event.wheelDelta;
            }
            if(!deltaY) return;
            const body = this.$refs.body;
            const currentScrollTop = body.scrollTop;
            if (deltaY < 0 && currentScrollTop !== 0) {
                event.preventDefault();
            }
            if (deltaY > 0 && body.scrollHeight - body.clientHeight > currentScrollTop) {
                event.preventDefault();
            }
            //body.scrollTop += deltaY;
            let step = 0;
            let timeId = setInterval(()=>{
                step += 5;
                if(deltaY>0){
                    body.scrollTop += 2;
                }
                else{
                    body.scrollTop -= 2;
                }
                if(step >= Math.abs(deltaY)){
                    clearInterval(timeId);
                }
            }, 5);
        },
        handleMouseWheel (event) {
            const deltaX = event.deltaX;
            const $body = this.$refs.body;

            if (deltaX > 0) {
                $body.scrollLeft = $body.scrollLeft + 10;
            } else {
                $body.scrollLeft = $body.scrollLeft - 10;
            }
        },
        handleSort (key, columnsState) {
            this.columnsState = columnsState
            const index = this.GetOriginalByKey(key);
            const order = columnsState[key].sortType;
            this.dataAdapter.dataBind(this.bindingSetting);
            this.$emit('on-sort-change', {
                column: JSON.parse(JSON.stringify(this.allColumns[this.cloneColumns[index]._index])),
                key,
                order
            });
        },
        handleFilterHide (column) {    // clear checked that not filter now
            // if (!this.cloneColumns[index]._isFiltered) this.cloneColumns[index]._filterChecked = [];
        },
        filterData (data, column) {
            return data.filter((row) => {
                // if (typeof column.filterRemote === 'function') return true;

                // let status = !column._filterChecked.length;
                // // TODO: Handle filter
                // for (let i = 0; i < column._filterChecked.length; i++) {
                //     status = column.filterMethod(column._filterChecked[i], row);
                //     if (status) break;
                // }
                // return status;
                return true;
            });
        },
        filterOtherData (data, index) {
            // let column = this.cloneColumns[index];
            // if (typeof column.filterRemote === 'function') {
            //     column.filterRemote.call(this.$parent, column._filterChecked, column.key, column);
            // }

            // this.cloneColumns.forEach((col, colIndex) => {
            //     if (colIndex !== index) {
            //         data = this.filterData(data, col);
            //     }
            // });
            return data;
        },
        handleFilter (key, columnsState) {
            const index = this.GetOriginalByKey(key);
            this.columnsState = columnsState
            const column = this.cloneColumns[index];
            this.page = 1;
            this.dataAdapter.dataBind(this.bindingSetting);

            this.$emit('on-filter-change', {
                column,
                columnsState
            });
        },
        refresh() {
            this.dataAdapter.dataBind(this.bindingSetting);
        },
        /**
         * #2832
         * 应该区分当前表头的 column 是左固定还是右固定
         * 否则执行到 $parent 时，方法的 index 与 cloneColumns 的 index 是不对应的
         * 左固定和右固定，要区分对待
         * 所以，此方法用来获取正确的 index
         * */
        GetOriginalIndex (_index) {
            return this.cloneColumns.findIndex(item => item._index === _index);
        },
        GetOriginalByKey (key) {
            return this.cloneColumns.findIndex(item => item.key === key);
        },
        handleSearch() {
            this.page = 1;
            this.dataAdapter.dataBind(this.bindingSetting);
        },
        handleFilterReset (key) {
            const index = this.GetOriginalByKey(key);
            this.page = 1;
            this.dataAdapter.dataBind(this.bindingSetting);
            this.$emit('on-filter-change', this.cloneColumns[index]);
        },
        makeData () {
            let data = deepCopy(this.data);
            data.forEach((row, index) => {
                row._index = index;
                row._rowKey = (typeof this.rowKey) === 'string' ? row[this.rowKey] : rowKey++;
                if (row.children && row.children.length) {
                    row.children = this.makeChildrenData(row);
                }
            });
            return data;
        },
        makeChildrenData (data) {
            if (data.children && data.children.length) {
                return data.children.map((row, index) => {
                    const newRow = deepCopy(row);
                    newRow._index = index;
                    newRow._rowKey = (typeof this.rowKey) === 'string' ? newRow[this.rowKey] : rowKey++;
                    if (newRow.children && newRow.children.length) {
                        newRow.children = this.makeChildrenData(newRow);
                    }
                    return newRow;
                });
            } else {
                return data;
            }
        },
        makeObjBaseData (row) {
            const newRow = deepCopy(row);
            if ((typeof this.rowKey) === 'string') {
                newRow._rowKey = newRow[this.rowKey];
            }
            newRow._isHover = false;
            if (newRow._disabled) {
                newRow._isDisabled = newRow._disabled;
            } else {
                newRow._isDisabled = false;
            }
            if (newRow._checked) {
                newRow._isChecked = newRow._checked;
            } else {
                newRow._isChecked = false;
            }
            if (newRow._expanded) {
                newRow._isExpanded = newRow._expanded;
            } else {
                newRow._isExpanded = false;
            }
            if (newRow._highlight) {
                newRow._isHighlight = newRow._highlight;
            } else {
                newRow._isHighlight = false;
            }
            return newRow;
        },
        makeObjData () {
            let data = {};
            if (this.data) {
                this.data.forEach((row, index) => {
                    const newRow = this.makeObjBaseData(row);
                    if (newRow.children && newRow.children.length) {
                        if (newRow._showChildren) {
                            newRow._isShowChildren = newRow._showChildren;
                        } else {
                            newRow._isShowChildren = false;
                        }
                        newRow.children = this.makeChildrenObjData(newRow);
                    }
                    // else if ('_loading' in newRow && newRow.children && newRow.children.length === 0) {
                    //     newRow._isShowChildren = false;
                    // }
                    data[index] = newRow;
                });
            }
            return data;
        },
        makeChildrenObjData (data) {
            if (data.children && data.children.length) {
                return data.children.map(row => {
                    const newRow = this.makeObjBaseData(row);
                    if (newRow._showChildren) {
                        newRow._isShowChildren = newRow._showChildren;
                    } else {
                        newRow._isShowChildren = false;
                    }
                    if (newRow.children && newRow.children.length) {
                        newRow.children = this.makeChildrenObjData(newRow);
                    }
                    return newRow;
                });
            } else {
                return data;
            }
        },
        // 修改列，设置一个隐藏的 id，便于后面的多级表头寻找对应的列，否则找不到
        makeColumnsId (columns) {
            const cloneColumns = deepCopy(columns);
            return cloneColumns.map(item => {
                if ('children' in item) this.makeColumnsId(item.children);
                item.__id = getRandomStr(6);
                return item;
            });
        },
        makeColumns (cols) {
            const self = this;
            // 在 data 时，this.allColumns 暂时为 undefined
            let columns = deepCopy(getAllColumns(cols));
            let left = [];
            let right = [];
            let center = [];

            columns.forEach((column, index) => {
                column._index = index;
                column._columnKey = columnKey++;
                column.width = parseInt(column.width);
                column._width = column.width ? column.width : '';    // update in handleResize()
                column._sortType = 'normal';

                if(column.type === 'action') {
                    column.render = (h, params) => {
                        return h( Button, {
                          type: 'text',
                          icon: 'md-more',
                          size: 'small',
                        //   shape: 'square',
                          onClick(event) {
                            nextTick(() => {
                                setTimeout(() => {
                                    self.contextmenuCurrentRow(params.row._index, undefined, event)
                                });
                            })
                          }
                        })
                    }
                }

                if (column.fixed && column.fixed === 'left') {
                    left.push(column);
                } else if (column.fixed && column.fixed === 'right') {
                    right.push(column);
                } else {
                    center.push(column);
                }
            });
            return left.concat(center).concat(right);
        },
        // create a multiple table-head
        makeColumnRows (fixedType, cols) {
            return convertToRows(cols, fixedType);
        },
        exportCsv (params) {
            if (params.filename) {
                if (params.filename.indexOf('.csv') === -1) {
                    params.filename += '.csv';
                }
            } else {
                params.filename = 'table.csv';
            }

            let columns = [];
            let datas = [];
            if (params.columns && params.data) {
                columns = params.columns;
                datas = params.data;
            } else {
                columns = this.allColumns;
                if (!('original' in params)) params.original = true;
                datas = params.original ? this.data : this.rebuildData;
            }

            let noHeader = false;
            if ('noHeader' in params) noHeader = params.noHeader;

            const data = Csv(columns, datas, params, noHeader);
            if (params.callback) params.callback(data);
            else ExportCsv.download(params.filename, data);
        },
        dragAndDrop(a,b) {
            this.$emit('on-drag-drop', a,b);
        },
        handleClickContextMenuOutside () {
            this.contextMenuVisible = false;
        },
        handleOnVisibleChange (val) {
            if (val) {
                nextTick(() => {
                    this.handleResize();
                });
            }
        },
        addTable (instance) {
            const target = this[instance];
            if (!target) return;
            if (!target.tableList) target.tableList = [];
            target.tableList.push({
                id: this.id,
                table: this
            });
        },
        removeTable (instance) {
            const target = this[instance];
            if (!target || !target.tableList) return;
            const index = target.tableList.findIndex(item => item.id === this.id);
            target.tableList.splice(index, 1);
        },
        closeContextMenu () {
            this.handleClickContextMenuOutside()
        },
        handleClickDropdownItem () {
            if (this.autoCloseContextmenu) this.closeContextMenu()
        },
        pageChange(page) {
            this.page = page;
            this.dataAdapter.dataBind(this.bindingSetting);
        },
        pageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.page = 1;
            // if (this.page === 1) {
            // }
            this.dataAdapter.dataBind(this.bindingSetting);
        },
        
    },
    created () {
        if (!this.context) this.currentContext = this.$parent;
        this.showSlotHeader = this.$slots.header !== undefined;
        this.showSlotFooter = this.$slots.footer !== undefined;
        // INIT
        this.dataAdapter.bind$.subscribe((resource) => {
            if (isArray(resource)) {
                this.data = resource;
                this.totalRecords = resource.length;
            } else if(isObject(resource)) {
                this.data = resource.records;
                this.totalRecords = resource.totalRecords;
            }
            this.objData = this.makeObjData();
            this.rebuildData = this.makeData();
            this.cloneData = deepCopy(this.data);
            nextTick(()=>this.fixedHeader());
        })
    },
    mounted () {
        this.addTable('TabsInstance');
        this.addTable('ModalInstance');
        this.addTable('DrawerInstance');

        this.handleResize();
        nextTick(() => {
            this.ready = true
            this.dataAdapter.dataBind(this.bindingSetting);
        });

        // on(window, 'resize', this.handleResize);
        this.observer = elementResizeDetectorMaker();
        this.observer.listenTo(this.$el, this.handleResize);

        this.resizeObserver.observe(this.$el.parentElement);
    },
    beforeUnmount () {
        this.removeTable('TabsInstance');
        this.removeTable('ModalInstance');
        this.removeTable('DrawerInstance');

        // off(window, 'resize', this.handleResize);
        this.observer.removeAllListeners(this.$el);
        this.observer.uninstall(this.$el);
        this.observer = null;
        this.resizeObserver.unobserve(this.$el.parentElement);
    },
    watch: {
        source: {
            handler () {
                if (isArray(this.source)) {
                    this.dataAdapter.cachedRecords = this.source;
                    this.dataAdapter.dataBind(this.bindingSetting);
                }
            },
            deep: true
        },
        columns: {
            handler () {
                // todo 这里有性能问题，可能是左右固定计算属性影响的
                const colsWithId = this.makeColumnsId(this.columns);
                this.allColumns = getAllColumns(colsWithId);
                this.cloneColumns = this.makeColumns(colsWithId);

                this.columnRows = this.makeColumnRows(false, colsWithId);
                this.leftFixedColumnRows = this.makeColumnRows('left', colsWithId);
                this.rightFixedColumnRows = this.makeColumnRows('right', colsWithId);
                // Todo: rebuild data.
                this.handleResize();
            },
            deep: true
        },
        height () {
            this.handleResize();
        },
        maxHeight () {
            this.handleResize();
        },
        showHorizontalScrollBar () {
            this.handleResize();
        },
        showVerticalScrollBar () {
            this.handleResize();
        }
    }
};
