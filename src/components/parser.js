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
import { capitalizeWord } from './helpers/capitalize-word'
import { createOuterColumns, setOuters, setUnits } from './actions/outers'
import { createMinMaxColumns, setMinMax } from './actions/min-max'
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
    this.removeEmptyProducts = this.removeEmptyProducts.bind(this)
    this.calculateMinMax = this.calculateMinMax.bind(this)
    this.createOuterQtyColumns = this.createOuterQtyColumns.bind(this)
    this.toggleLeftColumn = this.toggleLeftColumn.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderDownloadModal = this.renderDownloadModal.bind(this)
    this.renderUploadModal = this.renderUploadModal.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.parseFile = this.parseFile.bind(this)
    this.reloadCurrentFile = this.reloadCurrentFile.bind(this)
  }

  componentWillMount() {
  }

  loadData(result) {
    /*
     * load data from csv file for datagrid
     * meta stores field names
     * header stores user selectable field names
    */
    const data = result.data
    const meta = result.meta
    this.setState({
      data: data,
      meta: meta,
      headers: meta.fields
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

  renderDownloadModal() {
    /*
     * filter data by selected headers before passing to download
     */
    const { data, headers, file } = this.state
    const result = data.map(
      row => ( Object.keys(row)
        .filter(key => headers.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: row[key]
          };
        }, {})
      )
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
    this.setState({ headers: value.map( o => o.value )})

    // need to note if this is a new column and update data accordingly
    // find values not in original file headers
    const { meta } = this.state
    const newHeaders = value
      .map( (n) => n.value )
      .filter( (n) => !meta.fields.includes(n) )
    // map to data and add new fields if missing
    this.state.data.forEach(
      o => {
        newHeaders.forEach(
          header => { if (!o.hasOwnProperty(header)) o[header] = "" }
        )
      }
    )
  }

  createOuterQtyColumns() {
    this.updateHeaders(createOuterColumns(this.state))
    setOuters(this.state)
    setUnits(this.state)
  }

  calculateMinMax() {
    this.updateHeaders(createMinMaxColumns(this.state))
    setMinMax(this.state)
  }

  removeEmptyProducts() {
    const filterKeys = [
      "Jul2018 Qty Start",
      "Ytd Qty Sold",
      "On Hand",
      "Committed Stock",
      "Free Stock",
    ]

    let result = this.state.data.filter(
      row => {
        return (
          ( row[filterKeys[0]] > 0 && row[filterKeys[1]] >= 0 )
            || ( row[filterKeys[0]] >= 0 && row[filterKeys[1]] > 0 )
            && !row["Description"].toLowerCase().includes("pallet")
        )
      }
    )
    this.setState({ data: result })
  }

  updateDescription() {
    if (this.state.headers.indexOf('Description') !== -1) {
      var description, result
      this.state.data.forEach(
        o => {
          result = ''
          description = o.Description
          description.split(' ').forEach(
            s => {
              result += capitalizeWord(s) + ' '
            }
          )
          o.Description = result.trim()
        }
      )
    }
  }

  getReadableFileSizeString(fileSizeInBytes) {
    /*
     * from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
     */
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024)
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  render() {
    const { data, meta, file, headers, isLeftColumnOpen } = this.state
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
        <div className="pb3">
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
            </div>
        }
        { isLeftColumnOpen &&
          <div className={ Settings.style.colLeft }>
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
                <FileMeta
                  filename={ file.name }
                  rows={ data.length }
                  size={ this.getReadableFileSizeString(file.size) }
                />
                <ul className="pl0 list">
                  <li className="">
                    <FileAction
                      action={ this.removeEmptyProducts }
                    >Remove empty product lines
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.updateDescription }
                    >Lower case descriptions
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.calculateMinMax }
                    >Calculate min/max
                    </FileAction>
                  </li>
                  <li className="">
                    <FileAction
                      action={ this.createOuterQtyColumns }
                    >Outer qty columns
                    </FileAction>
                  </li>
                </ul>
              </div>
            }
            <div>
              { (this.isDataLoaded()) &&
              <div>
                <button className="bw0 br3 bg-green pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-green"
                  onClick={ () => this.openModal('renderDownloadModal') }>
                  Download result
                </button>
                <button className="bw0 br3 bg-blue pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-dark-blue"
                  onClick={ this.reloadCurrentFile }
                  >Reload file
                </button>
                <button className="bw0 br3 bg-gold pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-orange"
                  onClick={ this.clearData }>
                  Clear data
                </button>
              </div>
              }
              <button className="bw0 br3 bg-dark-blue pv2 ph3 mv1 white fw1 pointer db bg-animate hover-bg-navy"
                onClick={ () => this.openModal('renderUploadModal') }
                >Upload file
              </button>
            </div>
          </div>
        }
        { (this.isDataLoaded()) &&
          <div className={ `fl w-${ isLeftColumnOpen ? "80" : "100" }` }>
            <ReactTable
              data={ data }
              columns={ columns }
              defaultPageSize={ 200 }
              filterable={ true }
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

