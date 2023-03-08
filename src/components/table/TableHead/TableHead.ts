import { CheckboxGroup, Checkbox, Poptip, Button, Icon, Input, Select } from 'view-ui-plus'
// import Checkbox from '../checkbox/checkbox.vue';
// import Poptip from '../poptip/poptip.vue';
// import iButton from '../button/button.vue';
import renderHeader from 'view-ui-plus/src/components/table/header';
import Mixin from '../mixin';
import Locale from 'view-ui-plus/src/mixins/locale';
import { isClient } from 'view-ui-plus/src/utils/index';

export default {
    name: 'VTableHead',
    mixins: [ Mixin, Locale ],
    components: { CheckboxGroup, Checkbox, Poptip, Button, renderHeader, Icon, Input, Select },
    props: {
        prefixCls: String,
        styleObject: Object,
        columns: Array,
        objData: Object,
        data: Array,    // rebuildData
        columnsWidth: Object,
        fixed: {
            type: [Boolean, String],
            default: false
        },
        columnRows: Array,
        fixedColumnRows: Array
    },
    data () {
        return {
            draggingColumn: null,
            dragging: false,
            dragState: {},
            conditions: {
                string: [
                    'EMPTY',
                    'NOT_EMPTY',
                    'CONTAINS',
                    'DOES_NOT_CONTAIN',
                    'STARTS_WITH',
                    'ENDS_WITH',
                    'EQUAL',
                    'NULL',
                    'NOT_NULL',
                ],
                // possible conditions for numeric filter: 
                number: [
                    'EQUAL',
                    'NOT_EQUAL',
                    'LESS_THAN',
                    'LESS_THAN_OR_EQUAL',
                    'GREATER_THAN',
                    'GREATER_THAN_OR_EQUAL',
                    'NULL',
                    'NOT_NULL'
                ]
            }
        };
    },
    computed: {
        styles () {
            const style = Object.assign({}, this.styleObject);
            const width = parseInt(this.styleObject.width) ;
            style.width = `${width}px`;
            return style;
        },
        isSelectAll () {
            let isSelectAll = true;
            if (!this.data.length) isSelectAll = false;

            // 全部disabled且全false，#1751
            let isAllDisabledAndUnSelected = true;

            for (let i in this.objData) {
                const objData = this.objData[i];
                if (!objData._isChecked && !objData._isDisabled) {
                    isSelectAll = false;
                    break;
                } else if (objData.children && objData.children.length) {
                    isSelectAll = this.isChildrenSelected(objData, isSelectAll);
                }
                if (!(objData._isDisabled && !objData._isChecked)) {
                    isAllDisabledAndUnSelected = false;
                } else if (objData.children && objData.children.length) {
                    isAllDisabledAndUnSelected = this.isChildrenAllDisabledAndUnSelected(objData, isAllDisabledAndUnSelected);
                }
            }
            if (isAllDisabledAndUnSelected) isSelectAll = false;

            return isSelectAll;
        },
        headRows () {
            const isGroup = this.columnRows.length > 1;
            if (isGroup) {
                return this.fixed ? this.fixedColumnRows : this.columnRows;
            } else {
                return [this.columns];
            }
        },
        isSelectDisabled () {
            let isSelectDisabled = true;
            if (this.data.length) {
                for (let i in this.objData) {
                    const objData = this.objData[i];
                    if (!objData._isDisabled) {
                        isSelectDisabled = false;
                    } else if (objData.children && objData.children.length) {
                        isSelectDisabled = this.isChildrenDisabled(objData, isSelectDisabled);
                    }
                }
            }
            return isSelectDisabled;
        }
    },
    methods: {
        cellClasses (column) {
            return [
                `${this.prefixCls}-cell`,
                {
                    [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'),
                    [`${this.prefixCls}-cell-with-selection`]: column.type === 'selection'
                }
            ];
        },
        scrollBarCellClass(){
            let hasRightFixed = false;
            for(let i in this.headRows){
                for(let j in this.headRows[i]){
                    if(this.headRows[i][j].fixed === 'right') {
                        hasRightFixed=true;
                        break;
                    }
                    if(hasRightFixed) break;
                }
            }
            return [
                {
                    [`${this.prefixCls}-hidden`]: hasRightFixed
                }
            ];
        },
        itemClasses (column, item) {
            return [
                `${this.prefixCls}-filter-select-item`,
                {
                    [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
                }
            ];
        },
        itemAllClasses (column) {
            return [
                `${this.prefixCls}-filter-select-item`,
                {
                    [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
                }
            ];
        },
        selectAll () {
            const status = !this.isSelectAll;
            this.$parent.selectAll(status);
        },
        handleSort (index, type) {
            // 在固定列时，寻找正确的 index #5580
            const column = this.columns.find(item => item._index === index);
            const _index = column._index;

            if (column._sortType === type) {
                type = 'normal';
            }
            this.$parent.handleSort(_index, type);
        },
        handleSortByHead (index) {
            // 在固定列时，寻找正确的 index #5580
            const column = this.columns.find(item => item._index === index);
            if (column.sortable) {
                const type = column._sortType;
                if (type === 'normal') {
                    this.handleSort(index, 'asc');
                } else if (type === 'asc') {
                    this.handleSort(index, 'desc');
                } else {
                    this.handleSort(index, 'normal');
                }
            }
        },
        handleFilter (index) {
            this.$parent.handleFilter(index);
        },
        handleSelect (index, value) {
            this.$parent.handleFilterSelect(index, value);
        },
        handleReset (index) {
            this.$parent.handleFilterReset(index);
        },
        handleFilterHide (index) {
            this.$parent.handleFilterHide(index);
        },
        // 因为表头嵌套不是深拷贝，所以没有 _ 开头的方法，在 isGroup 下用此列
        getColumn (rowIndex, index) {
            const isGroup = this.columnRows.length > 1;

            if (isGroup) {
                const id = this.headRows[rowIndex][index].__id;
                return this.columns.filter(item => item.__id === id)[0];
            } else {
                return this.headRows[rowIndex][index];
            }
        },
        handleMouseDown (column, event) {
            if (this.$isServer) return;

            if (isClient && this.draggingColumn) {
                this.dragging = true;

                const table = this.$parent;
                const tableEl = table.$el;
                const tableLeft = tableEl.getBoundingClientRect().left;
                const columnEl = this.$el.querySelector(`th.ivu-table-column-${column.__id}`);
                const columnRect = columnEl.getBoundingClientRect();
                const minLeft = columnRect.left - tableLeft + 30;

                table.showResizeLine = true;

                this.dragState = {
                    startMouseLeft: event.clientX,
                    startLeft: columnRect.right - tableLeft,
                    startColumnLeft: columnRect.left - tableLeft,
                    tableLeft
                };

                const resizeProxy = table.$refs.resizeLine;
                resizeProxy.style.left = this.dragState.startLeft + 'px';

                document.onselectstart = function() { return false; };
                document.ondragstart = function() { return false; };

                const handleMouseMove = (event) => {
                    const deltaLeft = event.clientX - this.dragState.startMouseLeft;
                    const proxyLeft = this.dragState.startLeft + deltaLeft;

                    resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
                };

                const handleMouseUp = () => {
                    if (this.dragging) {
                        const {
                            startColumnLeft,
                            startLeft
                        } = this.dragState;

                        const finalLeft = parseInt(resizeProxy.style.left, 10);
                        const columnWidth = finalLeft - startColumnLeft;
                        const _column = table.allColumns.find(item => item.__id === column.__id);
                        if (_column) {
                            _column.width = columnWidth;
                            column.width = columnWidth;
                            table.handleResize();
                        }
                        table.$emit('on-column-width-resize', _column.width, startLeft - startColumnLeft, column, event);

                        isClient && (document.body.style.cursor = '');
                        this.dragging = false;
                        this.draggingColumn = null;
                        this.dragState = {};

                        table.showResizeLine = false;
                    }

                    if (!isClient) return;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.onselectstart = null;
                    document.ondragstart = null;
                };

                if (!isClient) return;
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        },
        handleMouseMove (column, event) {
            let target = event.target;

            while (target && target.tagName !== 'TH') {
                target = target.parentNode;
            }

            if (!column || !column.resizable) return;

            if (isClient && !this.dragging) {
                let rect = target.getBoundingClientRect();

                const bodyStyle = document.body.style;

                if (rect.width > 12 && rect.right - event.pageX < 8) {
                    bodyStyle.cursor = 'col-resize';
                    this.draggingColumn = column;
                } else if (!this.dragging) {
                    bodyStyle.cursor = '';
                    this.draggingColumn = null;
                }
            }
        },
        handleMouseOut () {
            if (this.$isServer) return;
            isClient && (document.body.style.cursor = '');
        },
        isChildrenSelected (objData, isSelectAll) {
            let status = isSelectAll;
            if (objData.children && objData.children.length) {
                objData.children.forEach(row => {
                    if (!row._isChecked && !row._isDisabled) {
                        status = false;
                    } else if (row.children && row.children.length) {
                        status = this.isChildrenSelected(row, status);
                    }
                });
            }
            return status;
        },
        isChildrenAllDisabledAndUnSelected (objData, isAllDisabledAndUnSelected) {
            let status = isAllDisabledAndUnSelected;
            if (objData.children && objData.children.length) {
                objData.children.forEach(row => {
                    if (!(row._isDisabled && !row._isChecked)) {
                        status = false;
                    } else if (row.children && row.children.length) {
                        status = this.isChildrenAllDisabledAndUnSelected(row, status);
                    }
                });
            }
            return status;
        },
        isChildrenDisabled (objData, isSelectDisabled) {
            let status = isSelectDisabled;
            if (objData.children && objData.children.length) {
                objData.children.forEach(row => {
                    if (!row._isDisabled) {
                        status = false;
                    } else if (row.children && row.children.length) {
                        status = this.isChildrenDisabled(row, status);
                    }
                });
            }
            return status;
        }
    }
};
