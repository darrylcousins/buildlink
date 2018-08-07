/**
 * @file Provides methods for adding outer columns and values
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const createOuterColumns = function(state) {
  // check for fields to populate - create if missing
  const addFields = [
    "MSL Code",
    "MSL Description",
    "UOM",
    "Unit Size",
    "Outer Qty",
    "Outer Desc",
    "Order in Outers",
    "Use Outers on Orders",
  ]
  const resultColumns = ["Code", "Description"]
  resultColumns.push(...addFields)
  let values = []
  resultColumns.forEach(
    field => values.push({'label': field, 'value': field })
  )
  return values
}

export const setOuters = function(state) {
  const { data } = state
  let outerQty = "Outer Qty"
  let unitSize = "Unit Size"
  data.forEach(
    (row, idx) => {
      if ( String(row[outerQty]) === "0") data[idx][outerQty] = ""
      if ( String(row[unitSize]) === "0") data[idx][unitSize] = ""
    }
  )
}
