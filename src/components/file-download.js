/**
 * @file Provides a `FileDownload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import { CSVLink } from 'react-csv'
import Select from 'react-select'

import Settings from '../settings'

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
      rowOptions: {}
    }
    this.handleInput = this.handleInput.bind(this)
    this.selectFilesize = this.selectFilesize.bind(this)

  }

  componentWillMount() {
    CSVFILENAME.test(this.state.inputValue) ?
      this.setState({ filenameValid: true }) :
      this.setState({ filenameValid: false })
    // remove useless options and present possible options
    this.setState({
      rowOptions: ROWSIZES.filter(
        n => ( this.props.data.length > n ? true: false )
      ).map(
        n => ( { label: n, value: n } )
      )
  })
  }

  handleInput(e) {
    let value = e.target.value
    this.setState({
      filenameValid: CSVFILENAME.test(value),
      inputValue: value,
    })
  }

  selectFilesize() {
  }

  render() {
    const { data, headers } = this.props
    let helpText = "Name the file to download ..."
    let warningText = "File name should end in `.csv`"
    let showWarning = this.state.filenameValid ? "dn" : "db"
    let inputColour = this.state.filenameValid ? "dark-green" : "red"
    return (
      <form>
        <label
          htmlFor="filename"
          className={ `black-60 f6 mb2 dn` }
        >{ helpText }</label>
        <span>Rows: { data.length }</span><br />
        { this.state.rowOptions.length > 0 &&
          <div className="pb3">
            <Select
              placeholder="Select row size ..."
              closeMenuOnSelect={ true }
              options={ this.state.rowOptions }
              onChange={ this.selectFilesize }
            />
          </div>
        }
        <input type="text"
          id="filename"
          className={ `input-reset sans-serif pa2 ba b--${ inputColour } ${ inputColour } br2` }
          placeholder={ this.state.inputValue ? this.state.inputValue : helpText }
          value={ this.state.inputValue }
          onChange={ this.handleInput }
        />
        <small
          id={ "filename-help-text" }
          className={ `${ showWarning } f6 lh-copy red mv2` }
        >{ warningText }
        </small>
        <div className={ this.state.filenameValid ? "db" : "dn" }>
          <CSVLink
            data={ data }
            headers={ headers }
            filename={ this.state.inputValue }
            className="sans-serif bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer no-underline bg-animate hover-bg-dark-blue fr"
          >Download file</CSVLink>
        </div>
      </form>
    )
  }
}

