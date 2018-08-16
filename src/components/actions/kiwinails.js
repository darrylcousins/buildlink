/**
 * @file Provides methods for matching kiwinail supplier file to stock
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

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

  matchWithSupplierCode() {
    const { stockData, supplierData } = this.props

    let challengeRow
    return stockData
      .map(
        row => {
          challengeRow = supplierData.find(
            r => (
              r["Barcode"] === row["Barcode"]
              && r["Supplier Code"] === row["Supplier Prod Code"]
            )
          )
          if (challengeRow) return Object.assign(challengeRow, row)
        }
      )
      .filter(
        row => row
      )
  }
}
