/**
 * @file Provides a `UploadFile` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileUpload extends React.Component {

  constructor(props) {
    super(props)
    this.userSelectFile = this.userSelectFile.bind(this)
    this.selectFile = this.selectFile.bind(this)
  }

  userSelectFile(files) {
    /*
     * operates within 'Upload file' modal form
     */
    document.getElementById('filename').value = files[0].name
    document.getElementById('uploadButton').classList.add('dib')
  }

  selectFile(files) {
    /*
     * operates within 'Upload file' modal form
     */
    document.getElementById('fileinput').click()
  }

  render() {
    return (
      <form>
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
          onClick={ this.props.loadFile }>
          Upload file
        </button>
      </form>
    )
  }
}

