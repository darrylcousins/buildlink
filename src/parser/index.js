/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import ReactTable from 'react-table'
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated'
import CreatableSelect from 'react-select/lib/Creatable'
import { Query } from 'graphql-tag'
import gql from 'graphql'
import Papa from 'papaparse'

import Settings from '../settings'
import { getHeaders } from '../client'
import Client from '../client'

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
    this.toLowerCase = this.toLowerCase.bind(this)
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

  findMatches(regex, value) {
  }

  toLowerCase(value) {
    const exceptions = {
              'X': 'x',
              'TE': 'TE',
              'SE': 'SE',
              'LTD': 'Ltd',
              'PER': 'per',
              }

    // Capture any words in all caps, also capture start and end parenthesis if they
    const allcaps_re = /[(]?\b[A-Z][A-Z]+\b[)]?/

    // Capture words that contain quantity abbreviations, like 90KG, 12MM etc.
    const quant_re= /\b[0-9\/]*[BXMKL][XMLG]?[0-9]*\b/

    /*
     * replace value with lower case and return
     */
    return value

  }

  updateDescription(e) {
    const headers = this.state.headers
    if (headers.indexOf('Description') !== -1) {
      this.state.data.forEach(
        o => ( o.Description = this.toLowerCase(o.Description) )
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
          <ul>
            <li>
              <a href="#" onClick={ this.updateDescription }>
                Convert descriptions
              </a>
            </li>
            <li>
              Calculate min/max values
            </li>
          </ul>
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

