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
                        <template v-else-if="column.type === 'action'">
                            <render-header v-if="column.renderHeader" :render="column.renderHeader" :column="column" :index="index"></render-header>
                        </template>
                        <template v-else>
                            <span v-if="!column.renderHeader" :class="{[prefixCls + '-cell-sort']: columnsState[column.key] && columnsState[column.key].sortable}" @click="handleSortByHead(column)">{{ column.title || '#' }}</span>
                            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
                            <span :class="[prefixCls + '-sort']" v-if="columnsState[column.key] && columnsState[column.key].sortable">
                                <i class="ivu-icon ivu-icon-md-arrow-dropup" :class="{on: columnsState[column.key].sortType === 'asc'}" @click="handleSort(column, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-md-arrow-dropdown" :class="{on: columnsState[column.key].sortType === 'desc'}" @click="handleSort(column, 'desc')"></i>
                            </span>
                            <Poptip
                                v-if="columnsState[column.key] && columnsState[column.key].filterable"
                                v-model="columnsState[column.key].filterVisible"
                                placement="bottom"
                                popper-class="ivu-table-popper"
                                transfer
                                :capture="false"
                                @on-popper-hide="handleFilterHide(column)">
                                <span :class="[prefixCls + '-filter']">
                                    <i class="ivu-icon ivu-icon-ios-funnel" :class="{on: columnsState[column.key].isFiltered}"></i>
                                </span>
                                
                                <template #content v-if="'date' === columnsState[column.key].filterType">
                                    
                                  <div :class="[prefixCls + '-filter-list']">
                                      <div :class="[prefixCls + '-filter-list-item']">
                                        <div class="mb-2">
                                              <Select v-model="columnsState[column.key].filterValue[0][0]" :transfer="true" size="small" style="width: 120px">
                                                  <Option v-for="(label, cond) in conditions[columnsState[column.key].filterType]" :value="cond">{{ label }}</Option>
                                              </Select>
                                          </div>
                                        <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="columnsState[column.key].filterValue[0][1]"></DatePicker>
                                        <Divider size="small"/>
                                        <div class="mb-2">
                                              <Select v-model="columnsState[column.key].filterValue[1][0]" :transfer="true" size="small" style="width: 120px">
                                                  <Option v-for="(label, cond) in conditions[columnsState[column.key].filterType]" :value="cond">{{ label }}</Option>
                                              </Select>
                                          </div>
                                        <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="columnsState[column.key].filterValue[1][1]"></DatePicker>
                                      </div>
                                      <div :class="[prefixCls + '-filter-footer']">
                                          <Button type="text" size="small" :disabled="!columnsState[column.key].filterValue" @click="handleFilter(column)">{{ t('i.table.confirmFilter') }}</Button>
                                          <Button type="text" size="small" @click="handleReset(column);">{{ t('i.table.resetFilter') }}</Button>
                                      </div>
                                  </div>
                                </template>
                                <template #content v-else-if="columnsState[column.key].filterType === 'checkedList'">
                                    <div :class="[prefixCls + '-filter-list']" v-if="columnsState[column.key].filterValue">
                                        <div :class="[prefixCls + '-filter-list-item']">
                                            <checkbox-group v-model="columnsState[column.key].filterValue[0][1]">
                                                <checkbox v-for="(item, index) in column.filters" :key="index" :label="item.value">{{ item.label }}</checkbox>
                                            </checkbox-group>
                                        </div>
                                        <div :class="[prefixCls + '-filter-footer']">
                                            <Button type="text" size="small" :disabled="!columnsState[column.key].filterValue[0][1].length" @click="handleFilter(column)">{{ t('i.table.confirmFilter') }}</Button>
                                            <Button type="text" size="small" @click="handleReset(column)">{{ t('i.table.resetFilter') }}</Button>
                                        </div>
                                    </div>
                                </template>
                                <template #content v-else-if="columnsState[column.key].filterType === 'list'">
                                    <div :class="[prefixCls + '-filter-list']">
                                        <ul :class="[prefixCls + '-filter-list-single']">
                                            <li
                                                :class="itemAllClasses(column)"
                                                @click="handleReset(column)">{{ t('i.table.clearFilter') }}</li>
                                            <li
                                                :class="itemClasses(column, item)"
                                                v-for="item in column.filters"
                                                :key="item.value"
                                                @click="handleSelect(column, item.value)">{{ item.label }}</li>
                                        </ul>
                                    </div>
                                </template>
                                <template #content v-else-if="['string', 'number'].includes(columnsState[column.key].filterType)">
                                    <Form @submit.prevent="handleFilter(column)">
                                        <div :class="[prefixCls + '-filter-list']" v-if="columnsState[column.key].filterValue">
                                            <div :class="[prefixCls + '-filter-list-item']">
                                                <div class="mb-2">
                                                    <Select v-model="columnsState[column.key].filterValue[0][0]" :transfer="true" size="small" style="width: 120px">
                                                        <Option v-for="(label, cond) in conditions[columnsState[column.key].filterType]" :value="cond">{{ label }}</Option>
                                                    </Select>
                                                </div>
                                                <Input placeholder="Search" style="width: 160px" v-model="columnsState[column.key].filterValue[0][1]">
                                                </Input>
                                            </div>
                                            <div :class="[prefixCls + '-filter-footer']">
                                                <Button type="text" size="small" :disabled="!columnsState[column.key].filterValue[0][1]" @click="handleFilter(column)">{{ t('i.table.confirmFilter') }}</Button>
                                                <Button type="text" size="small" @click="handleReset(column);">{{ t('i.table.resetFilter') }}</Button>
                                            </div>
                                        </div>
                                    </Form>
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
