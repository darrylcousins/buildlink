/**
 * @file Provides methods for adding min/max columns and values
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const createMinMaxColumns = function(state) {
  // check for fields to populate - create if missing
  const addFields = [
    "Min Qty",
    "Max Qty",
  ]
  const resultColumns = ["Code", "Description", "Last Supplier"]
  resultColumns.push(...addFields)
  let values = []
  resultColumns.forEach(
    field => values.push({'label': field, 'value': field })
  )
  return values
}

export const setMinMax = function(state) {
  const { data, meta } = state

  // check for require fields for calculations
  const requiredFields = [
    "Jul2018 Qty Start",
    "Ytd Qty Sold",
  ]
  let intersection = new Set(
    [...requiredFields].filter(x => meta.fields.indexOf(x) < 0)
  )

  if (intersection.size > 0) {
    let intersectionString = Array.from(intersection).map( i => i).join("\n")
    window.alert(`Action not possible without the fields:\n${ intersectionString }`)
    return null
  }

  data.forEach(
    (row, idx) => {
      let start = row[requiredFields[0]]
      let sold = row[requiredFields[1]]
      let outer = row["Outer Qty"]
      let min = 0, max = 0
      min = sold > start ? (sold/3 > start/2 ? sold/3 : start/2) : start/2
      // set max as min + outer or simply twice min
      min = Math.ceil(min)
      max = outer ? min + outer: 2 * min
      // some products may only need one on the shelf
      // but otherwise 2 is the min min
      if (
        row["Last Supplier"] !== "MAKLTD"
        && row["Last Supplier"] !== "ACCTOO"
      ) {
        min = min === 1 ? 2 : min
      }
      // if min is one then when sold don't order 2
      max = min === 1 ? 1 : max
      data[idx]["Min"] = Math.ceil(min)
      data[idx]["Max"] = Math.ceil(max)
    }
  )
}
