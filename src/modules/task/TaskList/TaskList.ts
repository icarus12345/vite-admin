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
      size: 10,
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 46,
          align: 'center',
          fixed: 'left'
        },
        {
          title: 'Title',
          slot: 'title',
          // ellipsis: true,
          // tooltip: true,
          sortable: true,
          sortType: 'desc',
          resizable: true,
          minWidth: 100,
          filterable: true,
          filterType: 'string', // list, string , checkedList, date, number, custom, range
          filterRender() {

          },
          filterMethod(value, row) {
            return row.address.indexOf(value) > -1;
          }
        },
        {
          title: 'User',
          slot: 'user',
          width: 160,
          sortable: true,
          sortMethod(a, b, type) {
            if (type === 'desc') {
              return a > b ? b : a;
            }
            return a > b ? a : b;
          },
          filterType: 'checkedList',
          filters: [],
          // filterMultiple: false,
          // filteredValue: [2],
          // filterMethod (value, row) {
          //   console.log(value,row,'value')
          //   if (value === 1) {
          //     return row.age > 25;
          //   } else if (value === 2) {
          //     return row.age < 25;
          //   }
          // },
          filterRemote(value: any, column: string) {
            console.log(value, column, this)
          }
        },
        {
          title: 'Status',
          slot: 'status',
          width: 70,
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
          title: '#',
          slot: 'action',
          width: 52,
          align: 'center',
          className: 'ivu-table-column-action',
          renderHeader(h, params) {
            return h( Button, {
              type: 'text',
              icon: 'md-add',
              size: 'small',
              shape: 'square',
              onClick() {
                alert(0)
              }
            })
          }
        }
      ],
      data: []
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
            value: u.id
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