<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styles">
        <colgroup>
            <col v-for="(column, index) in columns" :key="index" :width="setCellWidth(column)">
            <col v-if="$parent.showVerticalScrollBar" :width="$parent.scrollBarWidth"/>
        </colgroup>
        <thead>
            <tr v-for="(cols, rowIndex) in headRows" :key="rowIndex">
                <th
                    v-for="(column, index) in cols"
                    :key="index"
                    :colspan="column.colSpan"
                    :rowspan="column.rowSpan"
                    :class="alignCls(column)">
                    <div :class="cellClasses(column)">
                        <template v-if="column.type === 'expand'">
                            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <template v-else-if="column.type === 'selection'"><Checkbox v-if="!column.hideSelectAll" :model-value="isSelectAll" :disabled="isSelectDisabled" @on-change="selectAll"></Checkbox></template>
                        <template v-else>
                            <span v-if="!column.renderHeader" :class="{[prefixCls + '-cell-sort']: column.sortable}" @click="column.sortable && handleSortByHead(getColumn(rowIndex, index)._index)">{{ column.title || '#' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                                <i class="ivu-icon ivu-icon-md-arrow-dropup" :class="{on: getColumn(rowIndex, index)._sortType === 'asc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-md-arrow-dropdown" :class="{on: getColumn(rowIndex, index)._sortType === 'desc'}" @click="handleSort(getColumn(rowIndex, index)._index, 'desc')"></i>
                            </span>
                            <Poptip
                                v-if="isPopperShow(column)"
                                v-model="getColumn(rowIndex, index)._filterVisible"
                                placement="bottom"
                                popper-class="ivu-table-popper"
                                transfer
                                :capture="false"
                                @on-popper-hide="handleFilterHide(getColumn(rowIndex, index)._index)">
                                <span :class="[prefixCls + '-filter']">
                                    <i class="ivu-icon ivu-icon-ios-funnel" :class="{on: getColumn(rowIndex, index)._isFiltered}"></i>
                                </span>

                                <template #content v-if="['string', 'number'].includes(getColumn(rowIndex, index).filterType)">
                                    
                                    <div :class="[prefixCls + '-filter-list']">
                                        <div :class="[prefixCls + '-filter-list-item']">
                                            <div class="mb-2">
                                                <Select v-model="getColumn(rowIndex, index)._filterCondition" :transfer="true" size="small" style="width: 160px">
                                                    <Option v-for="(cond) in conditions[getColumn(rowIndex, index).filterType]" :value="cond">{{ cond }}</Option>
                                                </Select>
                                            </div>
                                            <Input placeholder="Search" style="width: 220px" v-model="getColumn(rowIndex, index)._filterValue">
                                            </Input>
                                        </div>
                                        <div :class="[prefixCls + '-filter-footer']">
                                            <Button type="text" size="small" :disabled="!getColumn(rowIndex, index)._filterValue" @click="handleFilter(getColumn(rowIndex, index)._index)">{{ t('i.table.confirmFilter') }}</Button>
                                            <Button type="text" size="small" @click="getColumn(rowIndex, index)._filterValue = '';handleReset(getColumn(rowIndex, index)._index);">{{ t('i.table.resetFilter') }}</Button>
                                        </div>
                                    </div>
                                </template>
                                <template #content v-else-if="getColumn(rowIndex, index).filterType === 'checkedList'">
                                    <div :class="[prefixCls + '-filter-list']">
                                        <div :class="[prefixCls + '-filter-list-item']">
                                            <checkbox-group v-model="getColumn(rowIndex, index)._filterChecked">
                                                <checkbox v-for="(item, index) in column.filters" :key="index" :label="item.value">{{ item.label }}</checkbox>
                                            </checkbox-group>
                                        </div>
                                        <div :class="[prefixCls + '-filter-footer']">
                                            <Button type="text" size="small" :disabled="!getColumn(rowIndex, index)._filterChecked.length" @click="handleFilter(getColumn(rowIndex, index)._index)">{{ t('i.table.confirmFilter') }}</Button>
                                            <Button type="text" size="small" @click="handleReset(getColumn(rowIndex, index)._index)">{{ t('i.table.resetFilter') }}</Button>
                                        </div>
                                    </div>
                                </template>
                                <template #content v-else-if="getColumn(rowIndex, index).filterType === 'list'">
                                    <div :class="[prefixCls + '-filter-list']">
                                        <ul :class="[prefixCls + '-filter-list-single']">
                                            <li
                                                :class="itemAllClasses(getColumn(rowIndex, index))"
                                                @click="handleReset(getColumn(rowIndex, index)._index)">{{ t('i.table.clearFilter') }}</li>
                                            <li
                                                :class="itemClasses(getColumn(rowIndex, index), item)"
                                                v-for="item in column.filters"
                                                :key="item.value"
                                                @click="handleSelect(getColumn(rowIndex, index)._index, item.value)">{{ item.label }}</li>
                                        </ul>
                                    </div>
                                </template>
                            </Poptip>
                        </template>
                    </div>
                    <div
                        v-if="column.resizable"
                        class="ivu-table-header-resizable"
                        @mousedown="handleMouseDown(column, $event)"
                        @mousemove="handleMouseMove(column, $event)"
                        @mouseout="handleMouseOut"
                    ></div>
                </th>

                <th v-if="$parent.showVerticalScrollBar && rowIndex===0" :class='scrollBarCellClass()' :rowspan="headRows.length"></th>
            </tr>
        </thead>
    </table>
</template>
<script lang="ts" src="./TableHead.ts"></script>
