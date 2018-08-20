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
import KiwiNails from './actions/kiwinails'
import ModalWrapper from './modal-wrapper'
import FileMeta from './file-meta'
import FileChoose from './file-choose'
import FileDownload from './file-download'
import FileUpload from './file-upload'
import DataTable from './data-table'

const buttonStyle = "w-100 bw0 br3 pv2 ph3 mv1 fw1 pointer db bg-animate"

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
      stockSort: [],
      stockFilter: [],

      resultData: [],
      resultMeta: {
        fields: []
      },
      resultHeaders: [],
      resultFile: {},
      resultSort: [],
      resultFilter: [],

      supplierData: [],
      supplierMeta: {
        fields: []
      },
      supplierHeaders: [],
      supplierFile: {},
      supplierSort: [],
      supplierFilter: [],

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
    this.getTableFilteredChange = this.getTableFilteredChange.bind(this)
    this.getTableSortedChange = this.getTableSortedChange.bind(this)
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
    this.matchKiwiNails = this.matchKiwiNails.bind(this)
    this.getTableStateStyle = this.getTableStateStyle.bind(this)
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
    /*
     * fileType one of 'result', 'stock', 'supplier'
     * XXX major method that sets the visible data of the table
     */
    let prop, data, meta, headers, file

    prop = `${ fileType }Data`
    if (this.state.hasOwnProperty(prop)) data = this.state[prop].map( row => row)

    prop = `${ fileType }Meta`
    if (this.state.hasOwnProperty(prop)) meta = { ...this.state[prop] }

    prop = `${ fileType }Headers`
    if (this.state.hasOwnProperty(prop)) headers = this.state[prop].map( header => header)

    prop = `${ fileType }File`
    if (this.state.hasOwnProperty(prop)) file = { ...this.state[prop] }

    this.setState({
      data: data,
      meta: meta,
      headers: headers,
      file: file,
      tableState: fileType,
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
    const { data, meta, tableState } = this.state
    const newHeaders = value
      .map( (n) => n.value )
      .filter( (n) => !meta.fields.includes(n) )

    // map to data and add new fields if missing
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
    if (tableState === "stock") {
      this.setState({
        data: newData,
        headers: headers,
        stockData: newData,
        stockHeaders: headers
      })
    } else {
      this.setState({
        data: newData,
        headers: headers,
      })
    }
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
    const { tableState } = this.state
    if (tableState === "result") this.setState({ result: filtered })
    if (tableState === "stock") this.setState({ stockFilter: filtered })
    if (tableState === "supplier") this.setState({ supplierFilter: filtered })
  }

  getTableFilteredChange() {
    /*
     * fileType one of 'result', 'stock', 'supplier'
     */
    let prop = `${ this.state.tableState }Filter`
    if (this.state.hasOwnProperty(prop)) return this.state[prop]
    return []
  }

  onTableSortedChange(sorted, column, shiftKey) {
    const { tableState } = this.state
    if (tableState === "result") this.setState({ resultSort: sorted })
    if (tableState === "stock") this.setState({ "stockSort": sorted })
    if (tableState === "supplier") this.setState({ supplierSort: sorted })
  }

  getTableSortedChange() {
    /*
     * fileType one of 'result', 'stock', 'supplier'
     */
    let prop = `${ this.state.tableState }Sort`
    if (this.state.hasOwnProperty(prop)) return this.state[prop]
    return []
  }

  getTableStateStyle(tableState) {
    if (!tableState) {
      tableState = this.state.tableState
    }
    if (tableState === "result") return "bg-green white hover-bg-dark-green"
    if (tableState === "stock") return "bg-dark-blue white hover-bg-navy"
    if (tableState === "supplier") return "bg-gold white hover-bg-red"
  }

  matchKiwiNails() {
    console.log('Kiwinails')
    const { stockData, supplierData } = this.state
    let kiwinails = new KiwiNails({
      stockData: stockData,
      supplierData: supplierData,
    })

    let resultHeaders = kiwinails.updateColumns()
    this.updateHeaders(resultHeaders)
    resultHeaders = resultHeaders.map( header => header.value )

    const matchSupplierCodeData = kiwinails.matchWithSupplierCode()

    this.setState({
      data: matchSupplierCodeData,
      meta: { fields: resultHeaders },
      resultMeta: { fields: resultHeaders },
      resultData: matchSupplierCodeData,
      resultHeaders: resultHeaders,
      tableState: "result",
    })
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
      supplierData,
      supplierFile,
      resultData,
      resultFile,
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
              { resultFile && resultData.length > 0 &&
                <FileChoose
                  identifier="result"
                  renderType="titleLink"
                  tableState={ tableState }
                  onClick={ this.setTableData }
                  fileInfo={ { name: "result.csv", length: resultData.length } }
                />
              }
              { stockFile && stockData.length > 0 &&
                <FileChoose
                  identifier="stock"
                  renderType="titleLink"
                  tableState={ tableState }
                  onClick={ this.setTableData }
                  fileInfo={ { name: stockFile.name, length: stockData.length } }
                />
              }
              { supplierFile && supplierData.length > 0 &&
                <FileChoose
                  identifier="supplier"
                  renderType="titleLink"
                  tableState={ tableState }
                  onClick={ this.setTableData }
                  fileInfo={ { name: supplierFile.name, length: supplierData.length } }
                />
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
                { resultFile && resultData.length > 0 &&
                  <FileChoose
                    identifier="result"
                    renderType="metaLink"
                    tableState={ tableState }
                    onClick={ this.setTableData }
                    fileInfo={ { name: resultFile.name, length: resultData.length } }
                  />
                }
                { stockFile && stockData.length > 0 &&
                  <FileChoose
                    identifier="stock"
                    renderType="metaLink"
                    tableState={ tableState }
                    onClick={ this.setTableData }
                    fileInfo={ { name: stockFile.name, length: stockData.length } }
                  />
                }
                { supplierFile && supplierData.length > 0 &&
                  <FileChoose
                    identifier="supplier"
                    renderType="metaLink"
                    tableState={ tableState }
                    onClick={ this.setTableData }
                    fileInfo={ { name: supplierFile.name, length: supplierData.length } }
                  />
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
                <strong className="db bt b--black-50 black-70 ph2 pv1">Data Operations</strong>
                <button className="tl w-100 bw0 br3 bg-light-gray pv2 ph3 mv1 fw1 pointer db bg-animate hover-white hover-bg-gray"
                  onClick={ this.matchKiwiNails }
                  >Match KiwiNails
                </button>
              </div>
            }
            <div>
              <strong className="db bt b--black-50 black-70 ph2 pv1">Load Data</strong>
              { /* buttons */ }
              <button className={ `${ this.getTableStateStyle("stock") } ${ buttonStyle }` }
                onClick={ (e) => this.openModal(e, 'renderUploadModal') }
                >Upload stock file
              </button>
              { (this.isDataLoaded()) &&
              <div>
                <button className={ `${ this.getTableStateStyle("supplier") } ${ buttonStyle }` }
                  onClick={ (e) => this.openModal(e, 'renderSupplierUploadModal') }>
                  Upload Supplier File
                </button>
                <button className={ `${ this.getTableStateStyle("result") } ${ buttonStyle }` }
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
              filtered={ this.getTableFilteredChange }
              sorted={ this.getTableSortedChange }
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

