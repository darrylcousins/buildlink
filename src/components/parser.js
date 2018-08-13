/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import Select from 'react-select'
import Papa from 'papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft'

import { lowerCaseDescriptions } from './helpers/descriptions'
import { readableFileSizeString } from './helpers/filesize'
import { createOuterColumns, setOuters } from './actions/outers'
import { createCodeColumns } from './actions/codes'
import { createDescriptionColumns } from './actions/description'
import { createMinMaxColumns } from './actions/min-max'
import { createStockColumns } from './actions/products'
import { filterRows } from './actions/filter'
import { setUnits } from './actions/units'
import ModalWrapper from './modal-wrapper'
import FileMeta from './file-meta'
import FileDownload from './file-download'
import FileUpload from './file-upload'
import DataTable from './data-table'

export default class Parser extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      meta: {
        fields: []
      },
      headers: [],
      file: {},

      tableState: "",

      stockData: [],
      stockMeta: {
        fields: []
      },
      stockHeaders: [],
      stockFile: {},
      stockSort: {},
      stockFilter: {},

      supplierData: [],
      supplierMeta: {
        fields: []
      },
      supplierHeaders: [],
      supplierFile: {},
      supplierSort: {},
      supplierFilter: {},

      isModalOpen: false,
      isLeftColumnOpen: true,
      renderModalName: '',
    }
    this.loadStockData = this.loadStockData.bind(this)
    this.loadSupplierData = this.loadSupplierData.bind(this)
    this.isDataLoaded = this.isDataLoaded.bind(this)
    this.clearTableData = this.clearTableData.bind(this)
    this.setTableData = this.setTableData.bind(this)
    this.onTableFilteredChange = this.onTableFilteredChange.bind(this)
    this.onTableSortedChange = this.onTableSortedChange.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.updateHeaders = this.updateHeaders.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.filterByDescription = this.filterByDescription.bind(this)
    this.setUpdateColumns = this.setUpdateColumns.bind(this)
    this.toggleLeftColumn = this.toggleLeftColumn.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderDownloadModal = this.renderDownloadModal.bind(this)
    this.renderUploadModal = this.renderUploadModal.bind(this)
    this.renderSupplierUploadModal = this.renderSupplierUploadModal.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.parseFile = this.parseFile.bind(this)
    this.reloadCurrentFile = this.reloadCurrentFile.bind(this)
  }

  isDataLoaded() {
    return Boolean(this.state.file && this.state.data.length > 0)
  }

  clearTableData() {
    this.setState({
      data: [],
      meta: { fields: [] },
      headers: [],
      file: {},
    })
  }

  setTableData(fileType) {
    let data, meta, headers, file, tableState
    if (fileType === "supplier") {
      const { supplierData, supplierMeta, supplierHeaders, supplierFile } = this.state
      data = supplierData.map( row => row )
      meta = { ...supplierMeta }
      headers = supplierHeaders.map( header => header )
      file = supplierFile
      tableState = "supplier"
    } else if (fileType === "stock") {
      const { stockData, stockMeta, stockHeaders, stockFile } = this.state
      data = stockData.map( row => row )
      meta = { ...stockMeta }
      headers = stockHeaders.map( header => header )
      file = stockFile
      tableState = "stock"
    }
    this.setState({
      data: data,
      meta: meta,
      headers: headers,
      file: file,
      tableState: tableState,
    })
  }

  loadStockData(result, file) {
    /*
     * store stock data to state
    */
    this.setState({
      stockData: result.data,
      stockMeta: result.meta,
      stockHeaders: result.meta.fields,
      stockFile: file,
    })
    this.setTableData("stock")
  }

  loadSupplierData(result, file) {
    /*
     * store stock data to state
    */
    this.setState({
      supplierData: result.data,
      supplierMeta: result.meta,
      supplierHeaders: result.meta.fields,
      supplierFile: file,
    })
    this.setTableData("supplier")
  }

  parseFile(file, fileType) {
    let loadMethod = fileType === "stock" ? this.loadStockData : this.loadSupplierData
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: loadMethod
    })
  }

  loadFile(fileType) {
    let file = document.getElementById('fileinput').files[0]
    this.parseFile(file, fileType)
    this.closeModal()
  }

  reloadCurrentFile() {
    const { file } = this.state
    if (file ) {
      this.parseFile(file)
    }
  }

  toggleLeftColumn() {
    let { isLeftColumnOpen } = this.state
    this.setState({
      isLeftColumnOpen: !isLeftColumnOpen
    })
  }

  openModal(e, f) {
    /*
     * calls to open modal from buttons should include the render method for
     * the modal content
     */
    e.target.blur()
    this.setState({
      isModalOpen: true,
      renderModalName: f,
    })
  }

  closeModal(e) {
    this.setState({ isModalOpen: false })
  }

  renderModal() {
    if (!this.state.isModalOpen) return null
    if (this.hasOwnProperty(this.state.renderModalName)) {
      return this[this.state.renderModalName]()
    }
  }

  renderUploadModal() {
    return (
      <FileUpload
        loadFile={ this.loadFile }
        fileType="stock"
      />
    )
  }

  renderSupplierUploadModal() {
    return (
      <FileUpload
        loadFile={ this.loadFile }
        fileType="supplier"
      />
    )
  }

  renderDownloadModal() {
    /*
     * filter and order data by selected headers before passing to download
     */
    const { data, headers, file } = this.state
    let result = []
    data.forEach(
      o => {
        var row = {}
        headers.forEach( header =>  row[header] = o[header] )
        result.push(row)
      }
    )

    return (
      <FileDownload
        data={ result }
        headers={ headers }
        filename={ file.name }
        closeModal={ this.closeModal }
      />
    )
  }

  updateHeaders(value) {
    /*
     * update user selectable fields of csv file
    */
    const headers = value.map( o => o.value )

    // need to note if this is a new column and update data accordingly
    // find values not in original file headers
    const { data, meta } = this.state
    const newHeaders = value
      .map( (n) => n.value )
      .filter( (n) => !meta.fields.includes(n) )

    // map to data and add new fields if missing
    // change data in place
    const newData = data.map(
      row => {
        let nrow = {...row}
        newHeaders.forEach(
          header => { if (!nrow.hasOwnProperty(header)) nrow[header] = "" }
        )
        return nrow
      }
    )

    // stock data updated
    this.setState({
      data: newData,
      headers: headers,
      stockData: newData,
      stockHeaders: headers
    })
  }

  setUpdateColumns(selected, action) {
    switch(selected.value) {
      case "description": {
        // Format is Code, Desc, Desc1 ...
        this.updateHeaders(createDescriptionColumns(this.state))
        break
      }
      case "outer": {
        // Format is Stock Code, Branch, Min, Max
        this.updateHeaders(createOuterColumns(this.state))
        setOuters(this.state)
        setUnits(this.state)
        break
      }
      case "stock": {
        // Format is Stock Code, Short Desc, UOM, Group, Supplier, Franchise, Margin Grid, Unit Cost
        this.updateHeaders(createStockColumns(this.state))
        break
      }
      case "code": {
        // Format is Desc, Last Supplier, Supplier Code, Stock Code, Barcode
        this.updateHeaders(createCodeColumns(this.state))
        break
      }
      case "minmax": {
        // Format is Code, Min, Max ...
        this.updateHeaders(createMinMaxColumns(this.state))
        break
      }
      default: {
        break
      }
    }
  }

  updateDescription() {
    const newData = lowerCaseDescriptions(this.state)
    this.setState({data: newData})
  }

  filterByDescription() {
    const newData = filterRows("Description", "DTS", this.state)
    this.setState({data: newData})
  }

  getReadableFileSizeString(fileSizeInBytes) {
    return readableFileSizeString(fileSizeInBytes)
  }

  onTableFilteredChange(filtered, value) {
    const identifier = this.state.tableState
    console.log('Filter', identifier, filtered, value)
    switch(identifier) {
      case "stock": { this.setState({ stockFilter: filtered })
        break
      }
      case "supplier": {
        this.setState({
          supplierFilter: filtered
        })
        break
      }
      default: {
        break
      }
  }

  onTableSortedChange(sorted, column, shiftKey) {
    const identifier = this.state.tableState
    console.log('Sort', identifier, sorted, column, shiftKey)
  }

  render() {
    const {
      data,
      meta,
      headers,
      tableState,
      isLeftColumnOpen,
      stockData,
      stockFile,
      stockFilter,
      supplierData,
      supplierFile,
    } = this.state

    // actions available to set headers for import and updates
    const columnOptions = [
      { value: "description", label: "Description update" },
      { value: "code", label: "Supplier Code update" },
      { value: "minmax", label: "Min/Max update" },
      { value: "outer", label: "Outer update" },
      { value: "stock", label: "Stock import" },
    ]

    return (
      <div>
        { !isLeftColumnOpen &&
            <div className="db tl nt3">
              <button
                type="button"
                className="ph0 mh0 bg-transparent bn f5 pointer"
                onClick={ this.toggleLeftColumn }
                aria-label="Close"
              >
                <FontAwesomeIcon icon={ faBars } color="navy" />
              </button>
              { stockFile && stockData.length > 0 &&
                <div
                  className={ `${ tableState === "stock" ? "bg-black-60 white" : "" } pointer ml2 dib pa1 br1 br--top` }
                  onClick={ (e) => this.setTableData("stock") }
                  >
                  <strong>{ stockFile.name } ({ stockData.length } rows)</strong>
                </div>
              }
              { supplierFile && supplierData.length > 0 &&
                <div
                  className={ `${ tableState === "supplier" ? "bg-black-60 white" : "" } pointer ml2 dib pa1 br1 br--top` }
                  onClick={ (e) => this.setTableData("supplier") }
                  >
                  <strong>{ supplierFile.name } ({ supplierData.length } rows)</strong>
                </div>
              }
            </div>
        }
        { /* Left Column */ }
        { isLeftColumnOpen &&
          <div className="fl w-100 w-third-m w-20-l">
            { /* close button for left column */ }
            <div className={ `${ this.isDataLoaded() ? "db" : "dn" } tl nt3` }>
              <button
                type="button"
                className="ph0 mh0 bg-transparent bn f5 pointer"
                onClick={ this.toggleLeftColumn }
                aria-label="Close"
              >
                <FontAwesomeIcon icon={ faAngleDoubleLeft } color="navy" />
              </button>
            </div>
            { data.length > 0 &&
              <div>
                { /* file actions */ }
                { /* display file meta info */ }
                <div className="mt1">
                  <FileMeta
                    title = "Stock File"
                    identifier="stock"
                    tableState={ tableState }
                    filename={ stockFile.name }
                    rows={ stockData.length }
                    onClick={ this.setTableData }
                  />
                </div>
                { supplierFile && supplierData.length > 0 &&
                  <div className="mt1">
                    <FileMeta
                      title = "Supplier File"
                      identifier="supplier"
                      tableState={ tableState }
                      filename={ supplierFile.name }
                      rows={ supplierData.length }
                      onClick={ this.setTableData }
                    />
                  </div>
                }
                { /* actions to set header columns */ }
                { tableState === "stock" &&
                  <div className="mb2">
                    <strong className="db mt2 bt b--black-50 black-70 ph2 pv1">Set Output Columns</strong>
                    <Select
                      options={ columnOptions }
                      placeholder="Set Output Columns"
                      onChange={ this.setUpdateColumns }
                      isClearable={ true }
                      isRtl={ false }
                      blurInputOnSelect={ true }
                    />
                  </div>
                }
              </div>
            }
            <div>
              <strong className="db bt b--black-50 black-70 ph2 pv1">Load Data</strong>
              { /* buttons */ }
              <button className="w-100 bw0 br3 bg-dark-blue pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-navy"
                onClick={ (e) => this.openModal(e, 'renderUploadModal') }
                >Upload stock file
              </button>
              { (this.isDataLoaded()) &&
              <div>
                <button className="w-100 bw0 br3 bg-gold pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-red"
                  onClick={ (e) => this.openModal(e, 'renderSupplierUploadModal') }>
                  Upload Supplier File
                </button>
                <button className="w-100 bw0 br3 bg-green pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-green"
                  onClick={ (e) => this.openModal(e, 'renderDownloadModal') }>
                  Download result
                </button>
              </div>
              }
            </div>
          </div>
        }
        { /* Right Column */ }
        { (this.isDataLoaded()) &&
          <div className={ `fl ${ isLeftColumnOpen ? "w-two-thirds-m w-80-l" : "w-100" }` }>
            <DataTable
              data={ data }
              meta={ meta }
              headers={ headers }
              onChange={ this.updateHeaders }
              onFilteredChange={ this.onTableFilteredChange }
              onSortedChange={ this.onTableSortedChange }
            />
          </div>
        }
        <ModalWrapper
          isOpen={ this.state.isModalOpen }
          closeModal={ this.closeModal }
        >
          { this.renderModal() }
        </ModalWrapper>
      </div>
    )
  }
}

