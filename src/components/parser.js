/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import ReactTable from 'react-table'
import makeAnimated from 'react-select/lib/animated'
import CreatableSelect from 'react-select/lib/Creatable'
import Papa from 'papaparse'

import Settings from '../settings'
import ModalWrapper from './modal-wrapper'
import FileMeta from './file-meta'
import FileAction from './file-action'
import FileDownload from './file-download'
import FileUpload from './file-upload'
import { capitalizeWord } from './capitalize-word'

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
    this.calculateMinMax = this.calculateMinMax.bind(this)
    this.removeEmptyProducts = this.removeEmptyProducts.bind(this)
    this.toggleLeftColumn = this.toggleLeftColumn.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderDownloadModal = this.renderDownloadModal.bind(this)
    this.renderUploadModal = this.renderUploadModal.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.reloadCurrentFile = this.reloadCurrentFile.bind(this)
  }

  componentWillMount() {
    var csvFilePath = require("../datasets/winwal-products.csv");
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
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

  loadFile() {
    let file = document.getElementById('fileinput').files[0]
    Papa.parse(file, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
    this.closeModal()
    this.setState({ file: file} )
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

  reloadCurrentFile() {
    const { file } = this.state
    if (file ) {
      Papa.parse(file, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: this.loadData
      })
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
    console.log(value)

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

  calculateMinMax() {
    const { data, meta, headers } = this.state

    // check for require fields for calculations
    const requiredFields = [
      "Free Stock",
      "Ytd Qty Sold",
    ]
    let intersection = new Set(
      [...requiredFields].filter(x => meta.fields.indexOf(x) < 0)
    )
    if (intersection.size > 0) {
      let intersectionString = Array.from(intersection).map( i => i).join("\n")
      window.alert(`Action not possible without the fields:\n${ intersectionString }`)
      return null
    }

    // check for fields to populate - create if missing
    const addFields = [
      "Min",
      "Max",
    ]
    intersection = new Set(
      [...addFields].filter(x => meta.fields.indexOf(x) < 0)
    )
    if (intersection.size > 0) {
      // get currently selected headers
      let values = headers.map(
        header => ({'label': header, 'value': header})
      )
      intersection.forEach(
        field => values.push({'label': field, 'value': field })
      )
      this.updateHeaders(values)
    }

    data.forEach(
      (row, idx) => {
        let free = row["Free Stock"]
        let sold = row["Ytd Qty Sold"]
        data[idx]["Min"] = sold === 0 ? Math.round(free/2) : Math.round(sold/4)
        data[idx]["Max"] = sold === 0 ? Math.round(free) : Math.round(sold/2)
      }
    )

    // set final display for fun
    const resultColumns = ["Code", "Description"]
    resultColumns.push(...requiredFields)
    resultColumns.push(...addFields)
    let values = []
    resultColumns.forEach(
      field => values.push({'label': field, 'value': field })
    )
    this.updateHeaders(values)
  }

  removeEmptyProducts() {
    const filterKeys = [
      "Ytd Qty Sold",
      "Jul2018 Qty Start",
      "On Hand",
      "Committed Stock",
      "Free Stock",
    ]

    let result = this.state.data.filter(
      row => {
        // return true if all values of filterKeys not 0
        return Boolean(filterKeys
          .filter( key => row[key] !== 0 ).length)
      }
    )
    console.log(result.length)
    this.setState({ data: result })
  }

  clearData() {
    this.setState({
      data: [],
      meta: {
        fields: []
      },
      headers: [],
      file: {},
    })
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
                <span aria-hidden="true">&gt;</span>
              </button>
            </div>
        }
        { isLeftColumnOpen &&
          <div className={ Settings.style.colLeft }>
            <div className="db tl nt3">
              <button
                type="button"
                className="ph0 mh0 bg-transparent bn f5 pointer"
                onClick={ this.toggleLeftColumn }
                aria-label="Close"
              >
                <span aria-hidden="true">&lt;</span>
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
              defaultPageSize={ 17 }
              />
          </div>
          }
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

