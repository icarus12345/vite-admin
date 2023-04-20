import { CheckboxGroup, Checkbox, Poptip, Button, Icon, Input, Select, DatePicker } from 'view-ui-plus'
// import Checkbox from '../checkbox/checkbox.vue';
// import Poptip from '../poptip/poptip.vue';
// import iButton from '../button/button.vue';
import renderHeader from 'view-ui-plus/src/components/table/header';
import Mixin from '../mixin';
import Locale from 'view-ui-plus/src/mixins/locale';
import { isClient } from 'view-ui-plus/src/utils/index';
import { Selection } from '@/utils';

export default {
    name: 'VTableHead',
    mixins: [ Mixin, Locale ],
    components: { CheckboxGroup, Checkbox, Poptip, Button, renderHeader, Icon, Input, Select, DatePicker },
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
        fixedColumnRows: Array,
        selection: Selection
    },
    data () {
        return {
            draggingColumn: null,
            dragging: false,
            dragState: {},
            conditions: {
                string: {
                    CONTAINS: 'Contains',
                    DOES_NOT_CONTAIN: 'Does not contain',
                    STARTS_WITH: 'Start with',
                    ENDS_WITH: 'End with',
                    EQUAL: 'Equal',
                    NOT_EQUAL: 'Not equal',
                    NULL: 'Null',
                    NOT_NULL: 'Not null'
                },
                // possible conditions for numeric filter: 
                number: {
                    EQUAL: 'Equal',
                    NOT_EQUAL: 'Not equal',
                    LESS_THAN: 'Less than',
                    LESS_THAN_OR_EQUAL: 'Less than or equal',
                    GREATER_THAN: 'Greater than',
                    GREATER_THAN_OR_EQUAL: 'Greater than or equal',
                    NULL: 'Null',
                    NOT_NULL: 'Not null'
                },
                date: {
                    EQUAL: 'Equal',
                    NOT_EQUAL: 'Not equal',
                    LESS_THAN: 'Less than',
                    LESS_THAN_OR_EQUAL: 'Less than or equal',
                    GREATER_THAN: 'Greater than',
                    GREATER_THAN_OR_EQUAL: 'Greater than or equal',
                    NULL: 'Null',
                    NOT_NULL: 'Not null'
                }
            },
            columnsState: {
            }
        };
    },
    created() {
        [this.columns, this.columnRows, this.fixedColumnRows]
            .flat(Infinity)
            .filter(Boolean)
            .filter(column => column.key)
            .map(({key, filterable, filterType, sortable, sortType, filters}) => {
                let filterValue;
                if (filterType === 'date') {
                    filterValue = [
                        ['GREATER_THAN', ''],
                        ['LESS_THAN', ''],
                    ];
                } else if (filterType === 'checkedList') {
                    filterValue = [['IN', []]];
                } else if (filterType === 'list') {
                    filterValue = [['EQUAL', '']];
                } else {
                    filterValue = [['CONTAINS', '']];
                }
                this.columnsState[key] = {
                    filterable,
                    filterType,
                    filters,
                    filterVisible:  false,
                    isFiltered:     false,
                    filterValue,
                    sortable,
                    sortType
                }
            })
        this.selection.changed.subscribe((d) => {
            console.log(d,'selection::changed')
        })
    },
    mounted() {

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
        isUnSelectAll () {
            let isAllDisabledAndUnSelected = true;
            
            for (let i in this.objData) {
                const objData = this.objData[i];
                if (objData._isChecked) {
                    isAllDisabledAndUnSelected = false;
                } else if (objData.children && objData.children.length) {
                    isAllDisabledAndUnSelected = !this.isChildrenAllDisabledAndUnSelected(objData, isAllDisabledAndUnSelected);
                }
            }
            return isAllDisabledAndUnSelected;
        },
        headRows () {
            let hRows;
            const isGroup = this.columnRows.length > 1;
            if (isGroup) {
                hRows = this.fixed ? this.fixedColumnRows : this.columnRows;
            } else {
                hRows = [this.columns];
            }
            hRows.map((columns, row) => {
                columns.map((column, col) => {
                    if (isGroup) {
                        column._index = this.columns.find(item => item.__id === col.id)._index;
                    } else {
                        column._index = this.columns[col]._index;
                    }
                })
            })
            return hRows;
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
        },
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
                    [`${this.prefixCls}-filter-select-item-selected`]: this.columnsState[column.key].filterValue[0][1] === item.value
                }
            ];
        },
        itemAllClasses (column) {
            return [
                `${this.prefixCls}-filter-select-item`,
                {
                    [`${this.prefixCls}-filter-select-item-selected`]: this.columnsState[column.key].filterValue[0][1] === ''
                }
            ];
        },
        selectAll () {
            const status = !this.isSelectAll;
            this.$parent.selectAll(status);
        },
        handleSort (column, type) {
            const state = this.columnsState[column.key];
            Object.values(this.columnsState).forEach((state) => state.sortType = '');

            if (state.sortType === type) {
                type = '';
            }
            state.sortType = type;
            this.$parent.handleSort(column.key, this.columnsState);
        },
        handleSortByHead (column) {
            const state = this.columnsState[column.key];
            // 在固定列时，寻找正确的 index #5580
            if (state.sortable) {
                const type = state.sortType;
                if (type === 'asc') {
                    this.handleSort(column, 'desc');
                } else if (type === 'desc'){
                    this.handleSort(column, '');
                } else {
                    this.handleSort(column, 'asc');
                }
            }
        },
        handleFilter (column) {
            const state = this.columnsState[column.key];
            state.isFiltered = true;
            state.filterVisible = false
            this.$parent.handleFilter(column.key, this.columnsState);
        },
        handleSelect (column, value) {
            const state = this.columnsState[column.key];
            state.filterValue[0][1] = value;
            this.handleFilter(column);
        },
        handleReset (column) {
            const state = this.columnsState[column.key];
            if (state.filterType === 'date') {
                state.filterValue[0][1] = state.filterValue[1][1] = ''
            } else if (state.filterType === 'checkedList') {
                state.filterValue[0][1] = [];
            } else if (state.filterType === 'list') {
                state.filterValue[0][1] = '';
            } else {
                state.filterValue[0][1] = '';
            }
            state.isFiltered = false;
            state.filterVisible = false
            this.$parent.handleFilterReset(column.key);
        },
        handleFilterHide (column) {
            this.$parent.handleFilterHide(column.key);
        },
        // 因为表头嵌套不是深拷贝，所以没有 _ 开头的方法，在 isGroup 下用此列
        getColumn (rowIndex, index) {
            const isGroup = this.columnRows.length > 1;
            let column;
            if (isGroup) {
                const id = this.headRows[rowIndex][index].__id;
                column = this.columns.filter(item => item.__id === id)[0];
            } else {
                column = this.headRows[rowIndex][index];
            }
            return column;
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
        },
    }
};
