import { $TaskService } from '@/services'
import { catchError, finalize, of } from 'rxjs'
import { Button, Icon } from 'view-ui-plus';

export default {
  name: 'TaskList',
  components: {
  },
  props: {
    selectedIds: [String],
    selectedItems: Array
  },
  emits: ['selectionChange'],
  setup() {
    return {
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
          filters: [
            {
              label: 'Greater than 25',
              value: 1
            },
            {
              label: 'Less than 25',
              value: 2
            }
          ],
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
            return row.address.indexOf(value) > -1;
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