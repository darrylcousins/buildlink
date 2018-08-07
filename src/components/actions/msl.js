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
  ["galv", "coach", "bolt" ],
  ["(?:zinc|z\/c)", "coach", "bolt" ],
  ["csk", "pozi", "(?:screw|surefast)"],
  ["csk", "(?:zinc|z\/c)", "(?:sqdr|square)", "surefast"],
  ["csk", "(?:cl:?3)", "(?:sqdr|square)", "surefast"],
  ["csk", "s\/s", "(?:sqdr|square)", "surefast"],
  ["(?:cl:?4)", "hex", "tek"],
  ["(?:cl:?4)", "bugle", "screw"],
  ["(?:zinc|z\/c)", "bugle", "screw"],
  ["w/seal", "t17", "hex"],
  ["w/neo", "t17", "hex"],
  ["gypsum", "fine"],
  ["gypsum", "coarse"],
  ["torx", "deck", "csk", "t304"],
  ["torx", "deck", "rsd", "t304"],
  ["rivets"],
  ["washers", "galv", "square"],
  ["washers", "galv", "round"],
  ["threaded", "galv"],
  ["galv", "hex", "nut"],
  ["nylon", "nail", "mush"],
  ["nylon", "wall", "plug"],
  ["disc", "(?:steel|disc)"],
]

const COUNT = /(\(?([0-9]*)\)?)$/

const matchRow = function(target, input) {
  target["MSL Description"] = input["MSL Description"]
  for (var attr in input) {
    if (input.hasOwnProperty(attr) && target.hasOwnProperty(attr)) target[attr] = input[attr]
  }
  return target
}

export const mslMatchStock = function(state) {
  const { data, supplierFile_data } = state

  const items = [6, 8, 10, 12, 14, 16]

  let result = []

  items.forEach(
    item => {
      let regex, newData, supplierData, match, supplierMatch
      regex = new RegExp(`[A-Z](${ String(item) })([0-9]*)`)
      newData = data
        .filter(
          row => {
            return regex.test(row["Code"].trim())
          }
        )
      newData.map(
        row => {
          // torx deck screws
          if (row["Code"].startsWith("SCTDTS") && row["Code"].endsWith("100")) {
            match = row["Code"].slice(0, -3).match(regex)
          } else if (row["Code"].startsWith("SCTDTS") && row["Code"].endsWith("1000")) {
            match = row["Code"].slice(0, -4).match(regex)
          } else {
            match = row["Code"].match(regex)
          }

          // filter supplier data by code matching on dimensions
          supplierData = supplierFile_data
            .filter( supplierRow => {
              // torx deck screws
              if (supplierRow["MSL Code"].startsWith("DECK") && supplierRow["MSL Code"].endsWith("100")) {
                supplierMatch = supplierRow["MSL Code"].slice(0, -3).match(regex)
              } else {
                supplierMatch = supplierRow["MSL Code"].match(regex)
              }
              return supplierMatch && supplierMatch[1] === match[1] && supplierMatch[2] === match[2]
            }
          )
          // no matches just leave row as is
          if (supplierData.length === 0 ) {
            result.push(row)
            return
          }
          // one match, (hopefully) a perfect match
          if (supplierData.length === 1 ) {
            row = matchRow(row, supplierData[0])
            result.push(row)
            return
          }

          // find the set of words that matches the description
          let mymatch = MATCHES.filter(
            x => x.filter(
              r => {
                return new RegExp(`${ r }`).test(row["Description"].toLowerCase())
              }
            ).length === x.length
          )

          // rather expected from above filter to get a single array
          if ( mymatch.length > 0 ) {
            mymatch = mymatch[0]

            // mymatch is the array of search terms found in description

            // filter supplierData on matches to search terms
            // XXX rewrite to use filter
            let supplierMatch = []
            supplierData.forEach(
               o => {
                 let desc = o["MSL Description"]
                 let match_result = []
                 mymatch.forEach(
                   r => {
                     if (new RegExp(`${ r }`).test(desc.toLowerCase())) {
                       match_result.push(o)
                     }
                   }
                 )
                 if (mymatch.length === match_result.length) {
                   supplierMatch.push(o)
                 }
               }
            )

            if (supplierMatch.length === 1) {
              // one found, (hopefully) a perfect match
              row = matchRow(row, supplierMatch[0])
              result.push(row)
              return
            }
            if (supplierMatch.length > 1) {
              // use quantity values
              let count = row["Description"].match(COUNT)[2]
              let finalChance = supplierMatch.filter(
                o => {
                  return o["MSL Description"].match(COUNT)[2] === count
                }
              )
              if (finalChance.length === 1) {
                row = matchRow(row, finalChance[0])
                result.push(row)
                return
              }
              if (finalChance.length > 1) {
                // torx deck screws
                let nextChance = finalChance.filter(
                  o => {
                    if (o["MSL Description"].toLowerCase().includes("rsd")
                      || o["MSL Description"].toLowerCase().includes("bronze")) {
                      return false
                    }
                    return true
                  }
                )
                if (nextChance.length === 1) {
                  row = matchRow(row, nextChance[0])
                  result.push(row)
                  return
                }
              }
              if (finalChance.length === 0) {
                console.log(row["Description"])
                console.log(finalChance)
                console.log("===============================")
              }
            }

          }
          // no matching return row
          result.push(row)
          return
        }
      )
    }
  )
}
