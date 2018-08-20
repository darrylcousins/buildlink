/**
 * @file Provides a `DataTable` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import ReactTable from 'react-table'
import makeAnimated from 'react-select/lib/animated'
import CreatableSelect from 'react-select/lib/Creatable'

export default class DataTable extends React.Component {

  render() {
    const {
      data,
      meta,
      headers,
      onChange,
      onFilteredChange,
      onSortedChange,
      filtered,
      sorted,
    } = this.props
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

    const classNames =  `pb1 black-60`
    return (
      <div className="pl3">
        <div className="pb1">
          { data.length > 0 &&
            <CreatableSelect
              closeMenuOnSelect={ true }
              components={ makeAnimated() }
              options={ options }
              value={ values }
              onChange={ onChange }
              isMulti
            />
          }
        </div>
        <div className={ classNames }>
          Bless
        </div>
        <ReactTable
          data={ data }
          columns={ columns }
          defaultPageSize={ 15 }
          filterable={ true }
          onFilteredChange={ onFilteredChange }
          onSortedChange={ onSortedChange }
          sorted={ sorted() }
          filtered={ filtered() }
          defaultFilterMethod={ (filter, row, column) => {
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id]).includes(filter.value) : true
          } }
          />
      </div>
    )
  }
}


