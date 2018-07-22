/**
 * @file Provides a `FileDownload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import { CSVLink } from 'react-csv'
import Select from 'react-select'
import Papa from 'papaparse'
import DownloadFile from 'js-file-download'
import JSZip from 'jszip'

import Settings from '../settings'
import { zipFile } from './zip'

// Capture csv filename
const CSVFILENAME = /.+(\.csv)$/

// set file sizes by row count
const ROWSIZES = [100, 200, 400]

export default class FileDownload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filenameValid: false,
      fileName: props.filename ? props.filename : 'test.csv',
      rowOptions: {},
      rowsPerFile: props.data.length,
      includeHeaders: false,
      fileCount: 1,
    }
    this.download = this.download.bind(this)
    this.validateFilename = this.validateFilename.bind(this)
    this.selectFilesize = this.selectFilesize.bind(this)
    this.toggleInputHeaders = this.toggleInputHeaders.bind(this)

  }

  componentWillMount() {
    CSVFILENAME.test(
      this.state.fileName) ?
      this.setState({ filenameValid: true }) :
      this.setState({ filenameValid: false }
    )
    let rowSizes = Array.from(ROWSIZES)
    rowSizes.unshift(this.state.rowsPerFile)
    this.setState({
      rowOptions: rowSizes.map(
        n => ( { label: n, value: n } )
      )
    })
  }

  download() {
  /*
   * the action after validation
   */
    const { closeModal, data, headers } = this.props
    const { rowsPerFile, fileCount, includeHeaders, fileName } = this.state
    let csv
    if (fileCount == 1) {
      csv = Papa.unparse(
        data, {
          quotes: true,
          header: includeHeaders
        })
      DownloadFile(csv, fileName)
    } else {
      let zip = JSZip()
      let parts = fileName.split('.')
      let suffix = parts.pop()
      let folderName = parts.join('.')
      let start, end, n, fileData, newFilename
      // python would be: for n in range(N)
      for (n of Array.from(Array(fileCount).keys())) {
        start = rowsPerFile * n
        end = (rowsPerFile * (n + 1))
        fileData = data.slice(start, end)
        csv = Papa.unparse(
          fileData, {
            quotes: true,
            header: includeHeaders
          })
        newFilename = `${ folderName }(${ String(n + 1) }).${ suffix }`
        zip.file(newFilename, csv)
      }
      zip.generateAsync({ type: "blob" })
        .then( blob => DownloadFile(blob, `${ folderName }.zip`) )
    }
    closeModal()
  }

  validateFilename(e) {
    let value = e.target.value
    this.setState({
      filenameValid: CSVFILENAME.test(value),
      fileName: value,
    })
  }

  toggleInputHeaders() {
    let { includeHeaders } = this.state
    includeHeaders = !includeHeaders
    this.setState( {
      includeHeaders: includeHeaders,
    })
  }

  selectFilesize(value) {
    const { data } = this.props
    let rowsPerFile = value.value
    let fileCount = Math.ceil(data.length/rowsPerFile)
    this.setState({
      rowsPerFile: rowsPerFile,
      fileCount: fileCount,
    })
  }

  render() {
    const { data, headers } = this.props
    const {
      fileCount,
      rowOptions,
      includeHeaders,
      fileName,
      filenameValid } = this.state
    let helpText = "Name the file to download ..."
    let warningText = "File name should end in `.csv`"
    let showWarning = this.state.filenameValid ? "dn" : "db"
    let inputColour = this.state.filenameValid ? "dark-green" : "red"
    return (
      <div>
        <label
          htmlFor="filename"
          className={ `black-60 f6 mb2 db` }
        >Select row count for download</label>
        { rowOptions.length > 0 &&
          <div className="mv2">
            <Select
              defaultValue={ rowOptions[0] }
              closeMenuOnSelect={ true }
              options={ rowOptions }
              onChange={ this.selectFilesize }
            />
          </div>
        }
        <div className="mv2">
          <label className="f6 black-60">
            <input
              type="checkbox"
              checked={ includeHeaders }
              onChange={ (e) => this.toggleInputHeaders(e.target.value) }
            />&nbsp;Include headers
          </label>
        </div>
        <div className="mv2">
          <input type="text"
            id="filename"
            className={ `input-reset sans-serif pa2 ba b--${ inputColour } ${ inputColour } br2 w-100` }
            placeholder={ ( fileName ? fileName : helpText ) }
            value={ fileName }
            onChange={ this.validateFilename }
          />
        </div>
        <small
          id={ "filename-help-text" }
          className={ `${ showWarning } f6 lh-copy red mv2` }
        >{ warningText }
        </small>
        <div className={ filenameValid ? "db" : "dn" }>
          <div
            className="f5 lh-copy blue"
          >{ `${fileCount } file${ fileCount > 1 ? "s" : "" } to download` }
          </div>
          <button
            className="sans-serif bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer no-underline bg-animate hover-bg-dark-blue fr"
            onClick={ this.download }
          >{ `Download ${ fileCount > 1 ? "all" : "file" }` }
          </button>
        </div>
      </div>
    )
  }
}

