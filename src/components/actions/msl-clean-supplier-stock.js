/**
 * @file Provides methods for extracting msl outers from price list
 *       Used as staging process and discarded, preserved for reference
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const COUNT_RE = /[(]\b([A-Z/]*)[ ]?([0-9]+)[ ]?[A-Z]*\b[)]/
const UOM_RE = /([A-Z]*)[ ]?([0-9]+)[ ]?[A-Z]*$/

export const processSupplierMSL = function(state) {
  /*
   * Try to extract unit of measurement and unit count and outer description
   * and quantity from the msl description
   */
  const { data } = state
  const desc = "MSL Description"
  const code = "MSL Code"
  const outer = "Outer Qty"
  const unit = "UOM"
  const unit_size = "Unit Size"
  const newData = [] // save to filter data
  data.forEach(
    (row, idx) => {
      let outerDesc, match, outerQty
      if (row[desc].toLowerCase().includes("no barcode")) {
        data.splice(idx, 1) // remove row in data
        return
      }
      if (row[code].endsWith("T")) {
        data.splice(idx, 1) // remove row in data
        return
      }
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
      if (row[code].includes("GYPCOL")) {
        if (row[desc].toLowerCase().includes("collated")) {
          outerDesc = "COLLATED"
          if (!outerQty) outerQty = "1000"
        }
      }
      if (row[code].endsWith("J") || row[code].endsWith("P") || row[code].endsWith("P100") || row[code].endsWith("BR100")) {
        if (!outerDesc) {
          outerDesc = "JAR"
        }
      }
      if (outerDesc) {
        let outerDescLower = outerDesc.toLowerCase()
        if (outerDescLower === "ctn")  outerDesc = "BOX"
        if (outerDescLower === "pkt")  outerDesc = "BOX"
        if (outerDescLower === "bkt")  outerDesc = "BOX"
        if (outerDescLower === "jars") outerDesc = "JAR"
        if (outerDescLower === "jar") outerDesc = "JAR"
        if (outerDescLower === "galv") outerDesc = ""
      }
      row[unit] = outerDesc ? outerDesc.charAt(0).toUpperCase() + outerDesc.slice(1).toLowerCase() : "Each"
      if (row[unit] === "Each") {
        row[outer] = outerQty
        row[unit_size] = ""
      } else {
        row[outer] = ""
        row[unit_size] = outerQty
      }
    }
  )
}

