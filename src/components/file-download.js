/**
 * @file Provides a `FileDownload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import { CSVLink } from 'react-csv'
import Select from 'react-select'
import Papa from 'papaparse'
import { DownloadFile } from 'js-file-download'

import Settings from '../settings'
import { zipFile } from './zip'

// Capture csv filename
const CSVFILENAME = /.+(\.csv)$/

// set file sizes by row count
const ROWSIZES = [200, 400]

export default class FileDownload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filenameValid: false,
      inputValue: props.filename ? props.filename : 'test.csv',
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
      this.state.inputValue) ?
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
    const { data, headers } = this.props
    const { rowsPerFile, fileCount, includeHeaders } = this.state
    console.log(fileCount)
    let csv = Papa.unparse(
      data, {
        header: includeHeaders
      })
    console.log(csv)
  }

  validateFilename(e) {
    let value = e.target.value
    this.setState({
      filenameValid: CSVFILENAME.test(value),
      inputValue: value,
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
      inputValue,
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
            placeholder={ inputValue ? inputValue : helpText }
            value={ inputValue }
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

