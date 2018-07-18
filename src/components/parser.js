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
      renderModalName: '',
    }
    this.loadData = this.loadData.bind(this)
    this.loadFile = this.loadFile.bind(this)
    this.updateHeaders = this.updateHeaders.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderDownloadModal = this.renderDownloadModal.bind(this)
    this.renderUploadModal = this.renderUploadModal.bind(this)
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
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
    this.closeModal()
    this.setState({ file: file} )
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
    return (
      <FileDownload
        data={ this.state.data }
        headers={ this.state.headers }
        filename={ this.state.file.name }
      />
    )
  }

  updateHeaders(value) {
    /*
     * update user selectable fields of csv file
    */
    if (Array.isArray(value)) {
      this.setState({ headers: value.map( o => o.value )})
    }
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
              result += ' ' + capitalizeWord(s)
            }
          )
          o.Description = result
        }
      )
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
          { this.state.data.length > 0 &&
            <div>
              <FileMeta
                filename={ this.state.file.name }
                rows={ this.state.data.length }
                size={ this.state.file.size }
              />
              <ul className="pl3">
                <li className="">
                  <FileAction
                    action={ this.updateDescription }
                  >Update descriptions
                  </FileAction>
                </li>
              </ul>
            </div>
          }
          <div>
            <button className="bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer dtc dib bg-animate hover-bg-dark-blue"
              onClick={ () => this.openModal('renderUploadModal') }
              >Upload file
            </button>
            { (this.state.file && this.state.data.length > 0 && this.state.headers.length > 0) &&
              <button className="bw0 br3 bg-green pv2 ph3 mv2 white fw1 pointer dtc dib bg-animate hover-bg-dark-green"
                onClick={ () => this.openModal('renderDownloadModal') }>
                Download result
              </button>
            }
          </div>
        </div>
        { (this.state.file && this.state.data.length > 0 && this.state.headers.length > 0) &&
          <div className={ Settings.style.colRight }>
            <ReactTable
              data={ data }
              columns={ columns }
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

