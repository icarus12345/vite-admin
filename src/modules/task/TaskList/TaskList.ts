import { $TaskService, $UserService } from '@/services'
import { catchError, finalize, of } from 'rxjs'
import { Button, Icon } from 'view-ui-plus'
import VTable from '@/components/table/Table/Table.vue'

export default {
  name: 'TaskList',
  components: {
    VTable
  },
  props: {
    selectedIds: [String],
    selectedItems: Array
  },
  emits: ['selectionChange'],
  setup() {
    return {
      userFilter: []
    }
  },
  data() {
    const me = this;
    return {
      page: 1,
      size: 100,
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 46,
          align: 'center',
          fixed: 'left',
          sticky: 'left'
        },
        {
          title: 'Title',
          slot: 'title',
          key: 'title',
          // ellipsis: true,
          // tooltip: true,
          sortable: true,
          sortType: 'desc',
          resizable: true,
          minWidth: 160,
          filterable: true,
          filterType: 'string', // list, string , checkedList, date, number, custom, range
          // filterMethod(row, operator, value) {
          //   return row.title.include(value);
          // }
        },
        {
          title: 'User',
          slot: 'user',
          key: 'user.name',
          // map: 'user.name',
          width: 160,
          sortable: true,
          sortMethod(a, b, type) {
            if (type === 'desc') {
              return a > b ? b : a;
            }
            return a > b ? a : b;
          },
          filterable: true,
          filterType: 'checkedList',
          filters: [{
            label: 'New York',
            value: 'New York'
          },
          {
            label: 'London',
            value: 'London'
          },
          {
            label: 'Sydney',
            value: 'Sydney'
          }],
          // filterMultiple: false,
          // filteredValue: [2],
          // filterMethod(row, operator, value) {
          //   return value.includes(row.user.name);
          // }
        },
        {
          title: 'Status',
          slot: 'completed',
          key: 'completed',
          width: 84,
          sortable: true,
          filterable: true,
          filterType: 'list',
          filters: [
            {
              label: 'New York',
              value: 'New York'
            },
            {
              label: 'London',
              value: 'London'
            },
            {
              label: 'Sydney',
              value: 'Sydney1111'
            }
          ],
          filterMethod(value, row) {
            return row.address && row.address.indexOf(value) > -1;
          }
        },
        {
          title: 'Create Date',
          key: 'create_date',
          width: 120,
          sortable: true,
          filterable: true,
          filterType: 'date',
          
          // filterMethod(row, operator, value) {
          //   return true
          // }
        },
        {
          title: '#',
          type: 'action',
          width: 52,
          align: 'center',
          fixed: 'right',
          sticky: 'right',
          className: 'ivu-table-column-action',
          // renderHeader(h, params) {
          //   return h( Button, {
          //     type: 'text',
          //     icon: 'md-add',
          //     size: 'small',
          //     shape: 'square',
          //     onClick() {
          //       alert(0)
          //     }
          //   })
          // },
          
        }
      ],
      data: [],
      dataSource: {
        url: 'https://jsonplaceholder.typicode.com/todos',
        beforeSend: (params: any) => {
          params._expand = 'user';
          params._start = (params.page - 1) * params.pageSize;
          params._limit = params.pageSize
        },
        beforeLoadComplete: (records: any) => {
          return {
            records: records,
            totalRecords: 500
          }
        },
        // formatData: (records: any) => {},
        // loadServerData: (settings: any, source: any, callback: any) => {}
      }
    }
  },
  created() {
    this.fetch()
    $UserService
      .all()
      .subscribe((users) => {
        this.columns[2].filters = users.map(u => {
          return {
            label: u.name,
            value: u.name
          }
        })
      })
  },
  methods: {
    fetch() {
      this.loading = true;
      $TaskService
        .all({
          _start: (this.page - 1) * this.size,
          _limit: this.size,
          _expand: 'user'
        })
        .pipe(
          finalize(() => (this.loading = false))
        )
        .subscribe((tasks) => {
          this.data = tasks
        })
    },
    sortChange(event: any) {
      console.log(event)
    },
    filterChange(event: any) {
      console.log(event)
    },
    pageChange(page: number) {
      this.page = page;
      this.fetch();
    },
    pageSizeChange(size: number) {
      this.size = size;
      if (this.page === 1) {
        this.fetch();
      }
    },
    contextMenu(row) {
      console.log(row)
    },
    contextMenuEdit() {

    },
    contextMenuDelete() {

    },
    selectionChange(event) {
      this.$emit('selectionChange', event)
    }
  }
}