/**
 * @file Provides methods for matching kiwinail supplier file to stock
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const DIMENSIONS_RE = /(\d+(?:\.\d+)?)[\s\D]+(\d+(?:\.\d+)?)/
const MASS_RE = /[0-9]{1,3}(?:kg|g)/i
const BFH_RE = /Bright Flat|BS FH/
const GFH_RE = /Galv Flat|Galv FH|Galvanised Flat/
const BJH_RE = /Bright Jolt|BS JH/
const GJH_RE = /Galv(?:anised)? Jolt|Galv JH/
const ROOF_RE = /Galv Roof Twisted|Galv Roof Spring/
const PRODUCT_RE = /Product Nail HD Galv|Galv Product/
const DECKING_RE = /Decking Annular|Galv Deck/
const CLOUT_RE = /Clout/i

export default class KiwiNails {

  constructor(props) {
    this.props = props
  }

  updateColumns() {
    let values = []
    let columns = [
      "Code",
      "Supplier Code",
      "Barcode",
      "Description",
      "Supplier Description",
    ]
    columns.forEach(
      field => values.push({'label': field, 'value': field })
    )
    return values
  }

  find(row, rows) {
    /*
     * supplierData is an array of rows
     * use Array.find to return the first row that satisfy the test
     * keep trying or return null
    */
    let challengeRow

    // simple first, match for barcode and supplier code
    challengeRow = rows.find(
      r => (
        r["Barcode"] === row["Barcode"]
        && r["Supplier Code"] === row["Supplier Prod Code"]
      )
    )
    //if (challengeRow) return Object.assign(challengeRow, row)

    // get match on dimensions
    const ROW = row["Description"]
    let rowMatch = ROW.match(DIMENSIONS_RE)
    if (rowMatch) rowMatch = [parseFloat(rowMatch[1]), parseFloat(rowMatch[2])]

    // match rows with widget dimensions
    challengeRow = rows.find(
      r => {
        let sRow = r["Supplier Description"]
        let challengeMatch = sRow.match(DIMENSIONS_RE)
        if (challengeMatch) {
          challengeMatch = [parseFloat(challengeMatch[1]), parseFloat(challengeMatch[2])]
          if (challengeMatch.every( e => rowMatch.includes(e) )) {
            // matched dimensions - check for weight figure
            let sMatchMass = sRow.match(MASS_RE)
            let rMatchMass = ROW.match(MASS_RE)
            if (sMatchMass && rMatchMass && (sMatchMass[0].toLowerCase() === rMatchMass[0].toLowerCase())) {
              if (GFH_RE.test(ROW)) console.log(GFH_RE.test(sRow), sRow)
              if (
                   (GJH_RE.test(sRow) && GJH_RE.test(ROW))
                || (BJH_RE.test(sRow) && BJH_RE.test(ROW))
                || (GFH_RE.test(sRow) && GFH_RE.test(ROW))
                || (BFH_RE.test(sRow) && BFH_RE.test(ROW))
                || (CLOUT_RE.test(sRow) && CLOUT_RE.test(ROW))
                || (ROOF_RE.test(sRow) && ROOF_RE.test(ROW))
                || (DECKING_RE.test(sRow) && DECKING_RE.test(ROW))
                || (PRODUCT_RE.test(sRow) && PRODUCT_RE.test(ROW))
              ) {
                return true
              }
            }
          }
        }
        return false
      }
    )
    if (challengeRow) return Object.assign(challengeRow, row)

    //console.log(ROW)

    return null
  }

  matchWithSupplierCode() {
    const { stockData, supplierData } = this.props

    let challengeRow
    return stockData
      .map(
        row => {
          return this.find(row, supplierData)
        }
      )
      .filter(
        row => row
      )
  }
}
