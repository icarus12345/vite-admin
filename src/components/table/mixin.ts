export default {
  methods: {
      alignCls (column: any, row: any = {}): any {
          let cellClassName = '';
          if (row.cellClassName && column.key && row.cellClassName[column.key]) {
              cellClassName = row.cellClassName[column.key];
          }
          return [
              `${this.prefixCls}-column-${column.__id}`,
              {
                  [`${cellClassName}`]: cellClassName,    // cell className
                  [`${column.className}`]: column.className,    // column className
                  [`${this.prefixCls}-column-${column.align}`]: column.align,
                  [`${this.prefixCls}-hidden`]: (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
              }
          ]
      },
      isPopperShow (column: any): boolean {
          return (column.filterable || column.filterType || column.filters) && ((!this.fixed && !column.fixed) || (this.fixed === 'left' && column.fixed === 'left') || (this.fixed === 'right' && column.fixed === 'right'))
      },
      setCellWidth (column: any): any {
          let width = ''
          if (column.width) {
              width = column.width
          } else if (this.columnsWidth[column._index]) {
              width = this.columnsWidth[column._index].width
          }
          if (width === '0') width = ''
          return width
      }
  }
}
