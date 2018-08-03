/**
 * @file Provides methods for filtering columns by value
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const filterRows = function(header, s, state) {
  // TODO use regex
  console.log('Filter Rows')
  const { data } = state
  let result = []
  data.forEach(
    o => {
      if (o[header].includes(s)) {
        result.push(o)
      }
    }
  )
  return result
}
