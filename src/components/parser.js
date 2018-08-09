/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import ReactTable from 'react-table'
import makeAnimated from 'react-select/lib/animated'
import CreatableSelect from 'react-select/lib/Creatable'
import Papa from 'papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft'

import Settings from '../settings'
import { lowerCaseDescriptions } from './helpers/descriptions'
import { readableFileSizeString } from './helpers/filesize'
import { createOuterColumns, setOuters } from './actions/outers'
import { createCodeColumns } from './actions/codes'
import { createDescriptionColumns } from './actions/description'
import { createMinMaxColumns, setMinMax } from './actions/min-max'
import { createStockColumns } from './actions/products'
import { filterRows } from './actions/filter'
import { trialRun } from './actions/trial'
import { setUnits } from './actions/units'
import { mslMatchStock } from './actions/msl'
import { mslMatchCode } from './actions/msl-code'
import ModalWrapper from './modal-wrapper'
import FileMeta from './file-meta'
import FileAction from './file-action'
import FileDownload from './file-download'
import FileUpload from './file-upload'

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
      supplierFile_data: [],
      supplierFile_meta: {
        fields: []
      },
      supplierFile_headers: [],
      supplierFile_file: {},
      isModalOpen: false,
      isLeftColumnOpen: true,
      renderModalName: '',
    }
    this.loadData = this.loadData.bind(this)
    this.isDataLoaded = this.isDataLoaded.bind(this)
    this.clearData = this.clearData.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.updateHeaders = this.updateHeaders.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.filterByDescription = this.filterByDescription.bind(this)
    this.removeEmptyProducts = this.removeEmptyProducts.bind(this)
    this.createUpdateMinMaxColumns = this.createUpdateMinMaxColumns.bind(this)
    this.createOuterQtyColumns = this.createOuterQtyColumns.bind(this)
    this.createNormalStockColumns = this.createNormalStockColumns.bind(this)
    this.createUpdateCodeColumns = this.createUpdateCodeColumns.bind(this)
    this.createUpdateDescriptionColumns = this.createUpdateDescriptionColumns.bind(this)
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
    this.loadSupplierFile = this.loadSupplierFile.bind(this)
    this.loadSupplierData = this.loadSupplierData.bind(this)
    this.mslStockUpdate = this.mslStockUpdate.bind(this)

    this.doTrialRun = this.doTrialRun.bind(this)
  }

  componentWillMount() {
    //let file = require('../datasets/products.csv')
    //this.parseFile(file)
  }

  loadData(result) {
    /*
     * load data from csv file for datagrid
     * meta stores field names
     * header stores user selectable field names
    */
    this.setState({
      data: result.data,
      meta: result.meta,
      headers: result.meta.fields
    })
  }

  isDataLoaded() {
    return Boolean(this.state.file && this.state.data.length > 0)
  }

  clearData() {
    this.setState({
      data: [],
      meta: { fields: [] },
      headers: [],
      file: {},
    })
  }

  parseFile(file) {
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
  }

  loadFile() {
    let file = document.getElementById('fileinput').files[0]
    this.parseFile(file)
    this.closeModal()
    this.setState({ file: file} )
  }

  reloadCurrentFile() {
    const { file } = this.state
    if (file ) {
      this.parseFile(file)
    }
  }

  parseSupplierFile(file) {
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: this.loadSupplierData
    })
  }

  loadSupplierData(result) {
    /*
     * load data from csv file
    */
    this.setState({
      supplierFile_data: result.data,
      supplierFile_meta: result.meta,
      supplierFile_headers: result.meta.fields,
    })
  }

  loadSupplierFile() {
    let file = document.getElementById('fileinput').files[0]
    this.parseSupplierFile(file)
    this.closeModal()
    this.setState({ supplierFile_file: file} )
  }

  toggleLeftColumn() {
    let { isLeftColumnOpen } = this.state
    this.setState({
      isLeftColumnOpen: !isLeftColumnOpen
    })
  }

  openModal(f) {
    /*
     * calls to open modal from buttons should include the render method for
     * the modal content
     */
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
      />
    )
  }

  renderSupplierUploadModal() {
    console.log("HERE")
    return (
      <FileUpload
        loadFile={ this.loadSupplierFile }
        colourTheme="supplier"
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
    this.setState({ headers: headers})

    // need to note if this is a new column and update data accordingly
    // find values not in original file headers
    const { meta } = this.state
    const newHeaders = value
      .map( (n) => n.value )
      .filter( (n) => !meta.fields.includes(n) )

    // map to data and add new fields if missing
    // change data in place
    this.state.data.forEach(
      o => {
        newHeaders.forEach(
          header => { if (!o.hasOwnProperty(header)) o[header] = "" }
        )
      }
    )
  }

  createOuterQtyColumns() {
    // Format is Stock Code, Branch, Min, Max
    this.updateHeaders(createOuterColumns(this.state))
    setOuters(this.state)
    setUnits(this.state)
  }

  createNormalStockColumns() {
    // Format is Stock Code, Short Desc, UOM, Group, Supplier, Franchise, Margin Grid, Unit Cost
    this.updateHeaders(createStockColumns(this.state))
  }

  createUpdateCodeColumns() {
    // Format is Desc, Last Supplier, Supplier Code, Stock Code, Barcode
    this.updateHeaders(createCodeColumns(this.state))
  }

  createUpdateDescriptionColumns() {
    // Format is Code, Desc, Desc1 ...
    this.updateHeaders(createDescriptionColumns(this.state))
  }

  createUpdateMinMaxColumns() {
    // Format is Code, Min, Max ...
    this.updateHeaders(createMinMaxColumns(this.state))
  }

  doTrialRun() {
    trialRun()
  }

  removeEmptyProducts() {
    /*
     * no longer in use
     */
    const filterKeys = [
      "Jul2018 Qty Start",
      "Ytd Qty Sold",
      "On Hand",
      "Committed Stock",
      "Free Stock",
    ]
    const desc = "Description"

    let result = this.state.data.filter(
      row => {
        return (
          (( row[filterKeys[0]] > 0 && row[filterKeys[1]] >= 0 )
            || ( row[filterKeys[0]] >= 0 && row[filterKeys[1]] > 0 ))
            && !row[desc].toLowerCase().includes("pallet")
            && !row[desc].toLowerCase().includes("^^")
        )
      }
    )
    this.setState({ data: result })
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

  mslStockUpdate() {
    mslMatchCode(this.state)
  }

  render() {
    const {
      data,
      meta,
      file,
      headers,
      isLeftColumnOpen,
      supplierFile_data,
      supplierFile_file,
    } = this.state
    // get currently selected headers for datagrid
    const columns = headers.map(
      header => (
        {'Header': header, 'accessor': header}
      )
    )
    // get possible headers for select options
    const options = meta.fields.map(
      header => ({'label': header, 'value': header})
    )
    // get currently selected headers
    const values = headers.map(
      header => ({'label': header, 'value': header})
    )
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
              <div className="ml2 dib">
                <strong>{ file.name }</strong>
              </div>
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
                <strong className="db bt b--black-90 br2 black-70 ph2 pv1">Set Output Columns</strong>
                { /* actions to set header columns */ }
                <ul className="pl0 list mt0">
                  <li className="">
                    <FileAction
                      action={ this.createUpdateDescriptionColumns }
                    >Description update
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.createUpdateCodeColumns }
                    >Supplier Code update
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.createUpdateMinMaxColumns }
                    >Min/max update
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.createOuterQtyColumns }
                    >Outer update
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.createNormalStockColumns }
                    >Stock import
                    </FileAction>
                  </li>
                </ul>
                { /* file actions */ }
                { /*
                <strong className="db black">Filter Data</strong>
                <ul className="pl0 list mt0">
                  <li className="">
                    <FileAction
                      action={ this.filterByDescription }
                    >Filter by "DTS" in description
                    </FileAction>
                  </li>
                </ul>
                { supplierFile_data.length > 0 &&
                  <div>
                    <strong className="db black">Match Files</strong>
                    <ul className="pl0 list mt0">
                      <li className="">
                        <FileAction
                          action={ this.mslStockUpdate }
                        >MSL code update
                        </FileAction>
                      </li>
                    </ul>
                  </div>
                }
                */ }
              </div>
            }
            <div>
              { /* buttons */ }
              <button className="w-100 bw0 br3 bg-dark-blue pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-navy"
                onClick={ () => this.openModal('renderUploadModal') }
                >Upload file
              </button>
              { (this.isDataLoaded()) &&
              <div>
                <button className="w-100 bw0 br3 bg-green pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-green"
                  onClick={ () => this.openModal('renderDownloadModal') }>
                  Download result
                </button>
                <button className="w-100 bw0 br3 bg-blue pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-blue"
                  onClick={ this.reloadCurrentFile }
                  >Reload file
                </button>
                <button className="w-100 bw0 br3 bg-red pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-red"
                  onClick={ () => this.openModal('renderSupplierUploadModal') }>
                  Upload Supplier File
                </button>
                <button className="w-100 bw0 br3 bg-gold pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-orange"
                  onClick={ this.clearData }>
                  Clear data
                </button>
                { /* display file meta info */ }
                <div className="mt4">
                  <FileMeta
                    title = "File"
                    filename={ file.name }
                    rows={ data.length }
                    size={ this.getReadableFileSizeString(file.size) }
                  />
                </div>
                { this.state.supplierFile_file && this.state.supplierFile_data.length > 0 &&
                  <div className="mt1">
                    <FileMeta
                      title = "Supplier File"
                      filename={ supplierFile_file.name }
                      rows={ supplierFile_data.length }
                      size={ this.getReadableFileSizeString(supplierFile_file.size) }
                    />
                  </div>
                }
              </div>
              }
            </div>
          </div>
        }
        { /* Right Column */ }
        { (this.isDataLoaded()) &&
          <div className={ `fl ${ isLeftColumnOpen ? "w-two-thirds-m w-80-l" : "w-100" }` }>
            <div className="pl3">
              <div className="pb1">
                { data.length > 0 &&
                  <CreatableSelect
                    closeMenuOnSelect={ true }
                    components={ makeAnimated() }
                    options={ options }
                    value={ values }
                    onChange={ this.updateHeaders }
                    isMulti
                  />
                }
              </div>
              <ReactTable
                data={ data }
                columns={ columns }
                defaultPageSize={ 17 }
                filterable={ true }
                defaultFilterMethod={ (filter, row, column) => {
                  const id = filter.pivotId || filter.id
                  return row[id] !== undefined ? String(row[id]).includes(filter.value) : true
                } }
                />
            </div>
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

