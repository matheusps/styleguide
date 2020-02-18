import React, { forwardRef } from 'react'
import classNames from 'classnames'

import useTableMotion from '../hooks/useTableMotion'

type Ref = any

const Row = forwardRef<Ref, RowProps>(
  (
    {
      tagName: Tag = 'tr',
      children,
      height,
      onClick,
      active,
      motion,
      highlightOnHover,
      ...props
    },
    ref
  ) => {
    const className = classNames('w-100 truncate overflow-x-hidden', {
      'pointer hover-c-link': onClick,
      'hover-bg-muted-5': highlightOnHover,
      'bg-action-secondary': active,
    })
    const style = {
      height,
      ...props.style,
      ...motion,
    }
    return (
      <Tag
        {...props}
        ref={ref}
        style={style}
        onClick={onClick}
        className={className}>
        {children}
      </Tag>
    )
  }
)

export const ROW_TRANSITIONS = [
  {
    prop: 'height',
    duration: 200,
    func: 'ease-in-out',
    delay: 0,
    optimize: true,
  },
]

export type RowProps = {
  active?: boolean
  height?: number
  onClick?: () => void
  motion?: ReturnType<typeof useTableMotion>
  highlightOnHover?: boolean
}

export default Row
