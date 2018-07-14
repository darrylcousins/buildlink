/**
 * @file Provides a `Parser` component for csv files
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import ReactTable from 'react-table'
import Select from 'react-select'
import makeAnimated from 'react-select/lib/animated'
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
    this.updateData = this.updateData.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    // Your parse code, but not seperated in a function
    var csvFilePath = require("../datasets/winwal-products.csv")
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.updateData
    })
  }

  updateData(result) {
    const data = result.data
    const meta = result.meta
    this.setState({
      data: data,
      meta: meta,
      headers: meta.fields
    })
  }

  handleChange(value) {
    console.log('You\'ve selected:', value)
    this.setState({ headers: value.map( o => o.value )})
    console.log(this.state.headers)
  }

  render() {
    const data = this.state.data
    const columns = this.state.headers.map(
      header => ({'Header': header, 'accessor': header})
    )
    const options = this.state.meta.fields.map(
      header => ({'label': header, 'value': header})
    )
    const values = this.state.headers.map(
      header => ({'label': header, 'value': header})
    )
    console.log(columns)
    console.log(options)
    return (
      <div>
        <div className="pb3">
          <Select
            closeMenuOnSelect={ true }
            components={ makeAnimated() }
            options={ options }
            value={ values }
            onChange={this.handleChange}
            isMulti
            />
        </div>
        <div className={ Settings.style.colLeft }>
          Left Col
        </div>
        <div className={ Settings.style.colRight }>
          <ReactTable
            data={data}
            columns={columns}
            />
        </div>
      </div>
    )
  }
}

