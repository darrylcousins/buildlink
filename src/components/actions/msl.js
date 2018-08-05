/**
 * @file Provides methods for matching stock to msl stock
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const MATCHES = [
  ["galv", "coach", "screw"],
  ["galv", "screw", "bolt", "hex"],
  ["galv", "sleeve", "anchor", "hex"],
  ["galv", "through", "bolt"],
  ["galv", "eng", "bolt" ],
  ["csk", "(?:zinc|z\/c)", "pozi"],
  ["csk", "(?:zinc|z\/c)", "(?:sqdr|square)"],
  ["(?:cl:?4)", "hex", "tek"]
]

export const mslMatchStock = function(state) {
  const { data, supplierFile_data } = state
  console.log('msl match stack', state)

  const items = [6, 8, 10, 12, 14, 16]

  let result = []

  let regex, newData, supplierData, match, supplierMatch
  items.forEach(
    item => {
      regex = new RegExp(`[A-Z](${ String(item) })([0-9]+)`)
      newData = data
        .filter( row => regex.test(row["Code"]) )
      newData.map(
        row => {
          match = row["Code"].match(regex)
          supplierData = supplierFile_data
            .filter( supplierRow => {
              supplierMatch = supplierRow["MSL Code"].match(regex)
              if (supplierMatch && supplierMatch[1] === match[1] && supplierMatch[2] === match[2]) {
                return true
              }
            }
          )
          if (supplierData.length === 0 ) {
            console.log("No Matches")
            result.push(row)
            return
          }
          if (supplierData.length === 1 ) {
            console.log(row["Description"], supplierData[0]["MSL Description"])
            row["MSL Description"] = supplierData[0]["MSL Description"]
            for (var prop in supplierData[0]) {
              if (supplierData[0].hasOwnProperty(prop) && row.hasOwnProperty(prop)) row[prop] = supplierData[0][prop]
            }
            result.push(row)
            return
          }
          //console.log(row["Code"], row["Description"])
          //console.log(supplierData.map(row => row["MSL Code"]+" "+row["MSL Description"]))
          result.push(row)
        }
      )
    }
  )
}
