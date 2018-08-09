/**
 * @file Provides methods for matching codes with barcodes
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const mslMatchCode = function(state) {
  const { data, supplierFile_data } = state

  data.map(
    row => {
      let newData = supplierFile_data
        .filter(
          drow => {
            return drow["Code"] === row["Code"]
          }
        )
      console.log(row)
      console.log(newData[0])
      console.log("==================")
      if (newData[0]["Barcode"]) {
        row["Barcode"] = newData[0]["Barcode"]
      }
    }
  )
}

