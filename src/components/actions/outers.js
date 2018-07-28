export const createOuterColumns = function(state) {
  const { data, meta, headers } = state
  // check for fields to populate - create if missing
  const addFields = [
    "UOM",
    "Outer Qty",
    "Outer Desc",
    "Order in Outers",
    "Use Outers on Orders",
  ]
  const resultColumns = ["Code", "Description", "Last Supplier"]
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
  data.forEach(
    (row, idx) => {
      if ( String(row[outerQty]) === "0") data[idx][outerQty] = ""
    }
  )
}

export const setUnits = function(state) {
  const { data } = state
  let unit = "UOM"
  let desc = "Description"
  data.forEach(
    (row, idx) => {
      let lwrDesc = row[desc].toLowerCase()
      if (
        (
          lwrDesc.includes("plywood")
          || lwrDesc.includes("gib")
          || lwrDesc.includes("mdf")
        )
        &&
        (
          lwrDesc.includes("1200")
          || lwrDesc.includes("1220")
        )
      ) data[idx][unit] = "Sheet"
    }
  )
}


