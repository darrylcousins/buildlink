/**
 * @file Provides methods for matching kiwinail supplier file to stock
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const DIMENSIONS_RE = /(\d+(?:\.\d+)?)[\s\D]+(\d+(?:\.\d+)?)/
const BJH_RE = /Bright Jolt|BS JH/
const GJH_RE = /Galv(?:anised)? Jolt|Galv JH/
const BFH_RE = /(\d+(?:\.\d+)?)[\s\D]+(\d+(?:\.\d+)?)/
const GFH_RE = /(\d+(?:\.\d+)?)[\s\D]+(\d+(?:\.\d+)?)/

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
    if (challengeRow) return Object.assign(challengeRow, row)

    // get match on dimensions
    let match = row["Description"].match(DIMENSIONS_RE)
    if (match) match = Array(match[1], match[2])

    // match rows with widget dimensions
    challengeRow = rows.find(
      r => {
        let challengeMatch = r["Supplier Description"].match(DIMENSIONS_RE)
        if (challengeMatch) {
          challengeMatch = Array(challengeMatch[1], challengeMatch[2])
          if (challengeMatch.every( e => match.includes(e) )) {
            // matched dimensions - check for other attributes
            console.log(challengeMatch, match)
          }
        }
        return false
      }
    )
    if (challengeRow) return Object.assign(challengeRow, row)


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
