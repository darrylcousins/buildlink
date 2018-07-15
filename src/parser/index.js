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
      headers: []
    }
    this.loadData = this.loadData.bind(this)
    this.updateHeaders = this.updateHeaders.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.capitalizeWord = this.capitalizeWord.bind(this)
  }

  componentWillMount() {
    // Your parse code, but not seperated in a function
    var csvFilePath = require("../datasets/winwal-products.csv")
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.loadData
    })
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

    let str_set = new Set(value.split(''))
    let intersection = new Set(
        [...str_set].filter(x => VOWELS.has(x.toLowerCase()))
      )

    // ignore anything without a vowel, e.g. DTS
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
          <CreatableSelect
            closeMenuOnSelect={ true }
            components={ makeAnimated() }
            options={ options }
            value={ values }
            onChange={ this.updateHeaders }
            isMulti
            />
        </div>
        <div className={ Settings.style.colLeft }>
          <a href="#" 
            className={ Settings.style.navLink }
            onClick={ this.updateDescription }>
            Convert descriptions
          </a>
          <br/>
          <a href="#" 
            className={ Settings.style.navLink }>
            Calculate min/max
          </a>
        </div>
        <div className={ Settings.style.colRight }>
          <ReactTable
            data={ data }
            columns={ columns }
            />
        </div>
      </div>
    )
  }
}

