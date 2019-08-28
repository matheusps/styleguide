import React, { FC } from 'react'
import PropTypes, { InferProps } from 'prop-types'

import SimpleTable from './SimpleTable/index'

import { TableProvider } from './context'
import Toolbar from './Toolbar/index'
import { DENSITY_OPTIONS, NAMESPACES } from './constants'

const propTypes = {
  nestedRows: PropTypes.bool,
  state: PropTypes.shape({
    schema: PropTypes.shape({
      columns: PropTypes.objectOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          cellRender: PropTypes.func,
        })
      ).isRequired,
      rowRender: PropTypes.func,
    }),
    items: PropTypes.arrayOf(PropTypes.object),
    isEmpty: PropTypes.bool,
    tableHeight: PropTypes.number,
    rowHeight: PropTypes.number,
    selectedDensity: PropTypes.oneOf(DENSITY_OPTIONS),
    setSelectedDensity: PropTypes.func,
  }),
}

type Props = InferProps<typeof propTypes>

interface Composites {
  Toolbar: FC
}

const Table: FC<Props> & Composites = ({ children, state, ...props }) => {
  return (
    <TableProvider value={{ ...state, ...props }}>
      <div id={NAMESPACES.CONTAINER}>
        {children}
        <SimpleTable />
      </div>
    </TableProvider>
  )
}

Table.Toolbar = Toolbar
Table.propTypes = propTypes

export default Table
