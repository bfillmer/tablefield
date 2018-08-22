
import React from 'react'
import {Table, Column, Cell} from 'fixed-data-table-2'
import {Close} from 'styled-icons/material/Close'

import 'fixed-data-table-2/dist/fixed-data-table.min.css'

import {A, Application} from 'view/Atoms'

import {ROUTE_ABOUT} from 'router'

const columns = {
  sku: 'SKU',
  productId: 'Product ID',
  title: 'Title',
  isbn: 'ISBN',
  boxOffice: 'Box Office',
  upc: 'UPC',
  oclc: 'OCLC',
  format: 'Format',
  artistAuthor: 'Artist/Author',
  streetDate: 'Street Date',
  rating: 'Rating',
  genre: 'Genre',
  media: 'Media',
  volume: 'Volume',
  discs: 'Discs',
  salesRank: 'Sales Rank',
  publisher: 'Publisher',
  productionYear: 'Production Year',
  lineItem: 'Line Item',
  spineLabel: 'Spine Label',
  callNumber: 'Call Number',
  processingNotes: 'Processing Notes',
  fund: 'Fund',
  shopper: 'Shopper',
  qty: 'QTY',
  price: 'Price',
  estProcess: 'Est. Process',
  estOCLC: 'Est. OCLC',
  vendorMarc: 'Vendor MARC',
  oclcMark: 'OCLC MARC',
  subtotal: 'Subtotal'
}

const widths = {
  sku: 150,
  productId: 150,
  title: 150,
  isbn: 150,
  boxOffice: 150,
  upc: 150,
  oclc: 150,
  format: 150,
  artistAuthor: 150,
  streetDate: 150,
  rating: 150,
  genre: 150,
  media: 150,
  volume: 150,
  discs: 150,
  salesRank: 150,
  publisher: 150,
  productionYear: 150,
  lineItem: 150,
  spineLabel: 150,
  callNumber: 150,
  processingNotes: 150,
  fund: 150,
  shopper: 150,
  qty: 150,
  price: 150,
  estProcess: 150,
  estOCLC: 150,
  vendorMarc: 150,
  oclcMark: 150,
  subtotal: 150
}

const debounce = (func, delay) => {
  let inDebounce
  return function () {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

function ToggleCell ({callback, children, rowIndex, ...props}) {
  return (
    <Cell onClick={() => callback(rowIndex)} {...props}>
      {children}
    </Cell>
  )
}

function HideCell ({callback, children, data, columnKey, ...props}) {
  return (
    <Cell {...props}>
      {children}
      <button onClick={() => callback(columnKey)}>
        <Close size={20} />
      </button>
    </Cell>
  )
}

export class Home extends React.Component {
  constructor (props) {
    super(props)

    this.applicationRef = React.createRef()

    this.state = {
      height: 0,
      width: 0,
      expandedRows: [],
      columns,
      columnKeys: Object.keys(columns),
      widths
    }

    this.setBounds = this.setBounds.bind(this)
    this.rowExpanded = this.rowExpanded.bind(this)
    this.expandClick = this.expandClick.bind(this)
    this.subRowHeightGetter = this.subRowHeightGetter.bind(this)
    this.setWidth = this.setWidth.bind(this)
    this.hideColumn = this.hideColumn.bind(this)
  }

  componentDidMount () {
    this.setBounds()
    this.debouncedSetBounds = debounce(this.setBounds, 50)

    window.addEventListener('resize', this.debouncedSetBounds)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedSetBounds)
  }

  setBounds () {
    const {height, width} = this.applicationRef.current.getBoundingClientRect()
    this.setState({
      height,
      width
    })
  }

  // Component to render as an expanded row.
  rowExpanded ({rowIndex, width, height}) {
    if (!this.state.expandedRows.includes(rowIndex)) {
      return null
    }

    return (<div>This is a detailed view, isn't it amazing.</div>)
  }

  // Calculate expended row height based on whether it exists in state.
  subRowHeightGetter (rowIndex) {
    return this.state.expandedRows.includes(rowIndex) ? 50 : null
  }

  expandClick (rowIndex) {
    if (this.state.expandedRows.includes(rowIndex)) {
      this.setState({
        expandedRows: this.state.expandedRows.filter(index => index !== rowIndex)
      })
    } else {
      this.setState({
        expandedRows: [
          ...this.state.expandedRows,
          rowIndex
        ]
      })
    }
  }

  setWidth (width, key) {
    this.setState({
      widths: {
        ...this.state.widths,
        [key]: width
      }
    })
  }

  hideColumn (key) {
    this.setState({
      columnKeys: this.state.columnKeys.filter(k => k !== key)
    })
  }

  render () {
    const {columnKeys, height, width, widths} = this.state

    return (
      <React.Fragment>
        {/* Testing unmounting via navigation. */}
        <A href={ROUTE_ABOUT}>Go to About and remove resize listener.</A>
        <Application innerRef={this.applicationRef}>
          <Table
            headerHeight={50}
            rowsCount={5000}
            rowHeight={50}
            rowExpanded={this.rowExpanded}
            subRowHeightGetter={this.subRowHeightGetter}
            onColumnResizeEndCallback={this.setWidth}
            isColumnResizing={false}
            width={width}
            height={height}
            touchScrollEnabled
          >
            {columnKeys.map(key =>
              <Column
                key={key}
                columnKey={key}
                header={<HideCell callback={this.hideColumn}>{columns[key]}</HideCell>}
                cell={<ToggleCell callback={this.expandClick}>{columns[key]}</ToggleCell>}
                width={widths[key]}
                fixed={key === 'sku'}
                isResizable
              />
            )}
          </Table>
        </Application>
      </React.Fragment>
    )
  }
}
