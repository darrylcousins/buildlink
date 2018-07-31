/**
 * @file Provides methods for extracting msl outers from price list
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const COUNT_RE = /[(]\b([A-Z]*)[ ]?([0-9]+)[ ]?[A-Z]*\b[)]/
const UOM_RE = /([A-Z]*)[ ]?([0-9]+)[ ]?[A-Z]*$/

export const createMSLColumns = function(state) {
  // check for fields to populate - create if missing
  const addFields = [
    "UOM",
    "Outer Qty",
    "Outer Desc",
    "Unit Size",
  ]
  const resultColumns = ["MSL Code", "MSL Description"]
  resultColumns.push(...addFields)
  let values = []
  resultColumns.forEach(
    field => values.push({'label': field, 'value': field })
  )
  return values
}

export const processMSL = function(state) {
  const { data } = state
  const desc = "MSL Description"
  const code = "MSL Code"
  const outer = "Outer Qty"
  const outer_desc = "Outer Desc"
  const unit = "UOM"
  const unit_size = "Unit Size"
  data.forEach(
    (row, idx) => {
      let outerDesc, match, outerQty
      match = row[desc].match(COUNT_RE)
      if (match !== null) {
        outerDesc = match[1]
        outerQty = match[2]
        if (row[code].startsWith("TT") && outerDesc === "") {
          outerDesc = "BOX"
        }
        if (row[code].startsWith("PRO") && outerDesc === "") {
          outerDesc = "JAR"
        }
      } else {
        match = row[desc].match(UOM_RE)
        if (match !== null) {
          outerDesc = match[1].length > 1 ? match[1] : ""
          outerQty = match[2]
        }
      }
      if (match !== null) {
        if (row[code] === null) console.log(match)
      }
      if (row[code].includes("GYPCOL") && outerDesc === "") {
        if (row[desc].toLowerCase().includes("collated")) {
          outerDesc = "COLLATED"
          if (!outerQty) outerQty = "1000"
        }
      }
      if (outerDesc) {
        let outerDescLower = outerDesc.toLowerCase()
        if (outerDescLower === "ctn")  outerDesc = "BOX"
        if (outerDescLower === "pkt")  outerDesc = "BOX"
        if (outerDescLower === "bkt")  outerDesc = "BOX"
        if (outerDescLower === "jars") outerDesc = "JAR"
        if (outerDescLower === "galv") outerDesc = ""
      }
      row[unit] = outerDesc ? outerDesc.charAt(0).toUpperCase() + outerDesc.slice(1).toLowerCase() : "Each"
      if (row[unit] === "Each") {
        row[outer] = outerQty
      } else {
        row[unit_size] = outerQty
      }
    }
  )
}
