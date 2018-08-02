/**
 * @file Provides `lowerCaseDescription` method
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

import { capitalizeWord } from './capitalize-word'

const filterData = function(key, data, filter) {
  let newData = []
  var description, result
  data.forEach(
    o => {
      result = ''
      description = o[key]
      if (typeof description === "string") {
        description.split(' ').forEach(
          s => {
            result += capitalizeWord(s) + ' '
          }
        )
        result = result.trim()
      } else {
        result = description
      }
      if (filter) {
        if (description !== result) {
          o[key] = result.trim()
          newData.push(o)
        }
      } else {
        if (result !== null) {
          o[key] = String(result).trim()
        }
        newData.push(o)
      }
    }
  )
  return newData
}

export const lowerCaseDescriptions = function(props) {
  let { headers, data } = props
  let newData
  let desc = "Description"
  if (headers.indexOf(desc) === -1) desc = "MSL Description"
  if (headers.indexOf(desc) !== -1) {
    newData = filterData(desc, data, false) // set to true to filter out already lower
  }
  desc = "Long Description 1"
  if (headers.indexOf(desc) !== -1) {
    data = filterData(desc, data, false)
  }
  return newData
}
