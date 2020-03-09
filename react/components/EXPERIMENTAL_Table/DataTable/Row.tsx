import React, { DetailedHTMLProps, forwardRef, FC } from 'react'
import classNames from 'classnames'
import pick from 'lodash/pick'

import useTableMotion from '../hooks/useTableMotion'
import { RFC, ComposableWithRef, Column } from '../types'
import { useBodyContext, useMeasuresContext, useHeadContext } from '../context'
import Cell, { CellComposites, CellProps } from './Cell'

const Row: RFC<HTMLTableRowElement, RowProps> = (
  { children, motion, data, ...props },
  ref
) => {
  const { columns } = useHeadContext()
  const { rowHeight, density } = useMeasuresContext()
  const { highlightOnHover, isRowActive, onRowClick } = useBodyContext()
  const className = classNames('w-100 truncate overflow-x-hidden', {
    'pointer hover-c-link': onRowClick,
    'hover-bg-muted-5': highlightOnHover || !!onRowClick,
    'bg-action-secondary': isRowActive && isRowActive(data),
  })
  const clickable = onRowClick && {
    onClick: () => onRowClick({ rowData: data }),
  }
  const style = {
    height: rowHeight,
    ...props.style,
    ...motion,
  }
  return (
    <tr {...props} ref={ref} style={style} {...clickable} className={className}>
      {columns.map((column: Column) => {
        const { id, cellRenderer, width, condensed, extended } = column
        const cellData = condensed
          ? pick(data, condensed)
          : extended
          ? data
          : data[id]

        const content = cellRenderer
          ? cellRenderer({
              data: cellData,
              rowHeight,
              density,
              motion,
            })
          : cellData

        const props = {
          key: id,
          width,
        }

        //TODO: Create types for renderProps
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        //@ts-ignore
        return children({
          props,
          data: content,
          column,
        })
      })}
    </tr>
  )
}

export const ROW_TRANSITIONS = [
  {
    prop: 'height',
    duration: 200,
    func: 'ease-in-out',
    delay: 0,
    optimize: true,
  },
]

type NativeTr = DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>

export interface RowProps extends NativeTr {
  active?: boolean
  onClick?: () => void
  motion?: ReturnType<typeof useTableMotion>
  data: unknown
}

interface Composites {
  Cell?: FC<CellProps> & CellComposites
}

export type ComposableRow = ComposableWithRef<
  HTMLTableRowElement,
  RowProps,
  Composites
>

const FowardedRow: ComposableRow = forwardRef(Row)

FowardedRow.Cell = Cell

export default FowardedRow
