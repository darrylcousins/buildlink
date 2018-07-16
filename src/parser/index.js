/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import ReactTable from 'react-table'
import Modal from 'react-modal'
import makeAnimated from 'react-select/lib/animated'
import CreatableSelect from 'react-select/lib/Creatable'
import Papa from 'papaparse'

import Settings from '../settings'

Modal.setAppElement(document.getElementById('root'));

// Modal styles
const customStyles = {
    content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          border: '3px',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)'
        }
}

// Capture any words in all caps, also capture start and end parenthesis if they
const ALLCAPS_RE = /[(]?\b[A-Z][A-Z]+\b[)]?/

// Capture words that contain quantity abbreviations, like 90KG, 12MM etc.
const QUANT_RE= /\b[0-9/]*[BXMKL][XMLG]?[0-9]*\b/

// define set of vowel characters
const VOWELS = new Set('aeiou'.split(''))

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
      modalIsOpen: false,
    }
    this.loadData = this.loadData.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.updateHeaders = this.updateHeaders.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.capitalizeWord = this.capitalizeWord.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.selectFile = this.selectFile.bind(this)
    this.loadFile = this.loadFile.bind(this)
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

  loadFile() {
    let file = document.getElementById('fileinput').files[0]
    console.log(file)
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
    this.closeModal()
    this.setState({ file: file} )
  }

  userSelectFile(files) {
    document.getElementById('filename').value = files[0].name
    document.getElementById('uploadButton').classList.add('dib')
  }

  selectFile(files) {
    document.getElementById('fileinput').click()
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  afterOpenModal() {
  }

  closeModal(e) {
    this.setState({modalIsOpen: false})
  }

  capitalizeWord(value) {
    const exceptions = {
              'X': 'x',
              'BX': 'bx',
              'TE': 'TE',
              'SE': 'SE',
              'LTD': 'Ltd',
              'PER': 'per',
              }

    // cover simple exceptions
    if (value in exceptions) return exceptions[value]

    // split and rejoin words that contain a /, e.g. BRACE/NOISE
    if (value.indexOf('/') !== -1) {
      return value.split('/').map(
        s => this.capitalizeWord(s)
      ).join('/')
    }

    /*
     * replace value with lower case and return
     */

    // ignore anything without a vowel, e.g. DTS
    let str_set = new Set(value.split(''))
    let intersection = new Set(
        [...str_set].filter(x => VOWELS.has(x.toLowerCase()))
      )

    if (intersection.size > 0) {
      if ( ALLCAPS_RE.test(value) ) return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    } else {
      if ( QUANT_RE.test(value) ) return value.toLowerCase()
    }

    // no matches, return value as it is
    return value
  }

  updateDescription(e) {
    const headers = this.state.headers
    var description, result
    if (headers.indexOf('Description') !== -1) {
      this.state.data.forEach(
        o => {
          result = ''
          description = o.Description
          description.split(' ').forEach(
            s => {
              result += ' ' + this.capitalizeWord(s)
            }
          )
          o.Description = result
        }
      )
    }
  }

  lowerCaseDescription(value) {
    console.log('Lower: ', value)
  }

  updateHeaders(value) {
    /*
     * update user selectable fields of csv file
    */
    console.log(value)
    if (Array.isArray(value)) {
      this.setState({ headers: value.map( o => o.value )})
    }
  }

  render() {
    const data = this.state.data
    // get currently selected headers for datagrid
    const columns = this.state.headers.map(
      header => ({'Header': header, 'accessor': header})
    )
    // get possible headers for select options
    const options = this.state.meta.fields.map(
      header => ({'label': header, 'value': header})
    )
    // get currently selected headers
    const values = this.state.headers.map(
      header => ({'label': header, 'value': header})
    )
    return (
      <div>
        <div className="pb3">
          { this.state.data.length > 0 &&
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
        <div className={ Settings.style.colLeft }>
          <div className="h5">
            { this.state.data.length > 0 &&
              <ul className="pl3">
                <li className="">
                  <a href="#"
                    className={ Settings.style.navLink }
                    onClick={ this.updateDescription }>
                    Convert descriptions
                  </a>
                </li>
                <li>
                  <a href="#"
                    className={ Settings.style.navLink }>
                    Calculate min/max
                  </a>
              </li>
            </ul>
          }
        </div>
          <div>
            <button className="bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer dtc dib bg-animate hover-bg-dark-blue"
              onClick={ this.openModal }>
              Upload file
            </button>
            <button className="bw0 br3 bg-green pv2 ph3 mv2 white fw1 pointer dtc dib bg-animate hover-bg-dark-green">
              Download result
            </button>
          </div>
        </div>
        <div className={ Settings.style.colRight }>
          { this.state.file &&
          <p>
            <span>{ this.state.data.length }</span>
            <span>{ this.state.file.name }</span>
            <span>{ this.state.file.size }</span>
            <span>{ String(this.state.file.lastModifiedDate) }</span>
              </p>
          }
          { (this.state.data.length > 0 && this.state.headers.length) &&
          <ReactTable
            data={ data }
            columns={ columns }
            />
          }
        </div>

        <Modal
          isOpen={ this.state.modalIsOpen }
          onAfterOpen={ this.afterOpenModal }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Example Modal"
          >
            <button
              type="button"
              className="ph0 mh0 bg-transparent bn f3 fr dib pointer"
              onClick={ this.closeModal }
              aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
        <form>
          <input type="file" className="dn" onChange={ (e) => this.handleUpload(e.target.files) } />`
          <div className="relative m3 dt dib">
            <div className="bw0 br3 b--dark-blue bg-blue pv2 ph3 mv2 white fw1 br2 br--left pointer dtc dib bg-animate hover-bg-dark-blue"
              onClick={ this.selectFile }>
              <span className="sans-serif">
                Browse&hellip;
                <input type="file"
                  className="dn"
                  onChange={ (e) => this.userSelectFile(e.target.files) }
                  id="fileinput" />
              </span>
            </div>
            <input type="text"
              id="filename"
              className="sans-serif dtc pa2 b--black-30 dib bt bl-0 bb br br3 br--right w5"
              placeholder="Select csv file"
              readOnly={ true }
            />
          </div>
            <button className="bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer dn bg-animate hover-bg-dark-blue fr"
              id="uploadButton"
              onClick={ this.loadFile }>
              Upload file
            </button>
        </form>
        </Modal>
      </div>
    )
  }
}

