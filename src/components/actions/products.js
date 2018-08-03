/**
 * @file Provides methods for adding columns for importing new normal products
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const createStockColumns = function(state) {
  // Format is Stock Code, Short Desc, UOM, Group, Supplier, Franchise, Margin Grid, Unit Cost
  // check for fields to populate - create if missing
  const resultColumns = [
    "Code",
    "Description",
    "UOM",
    "Group",
    "Last Supplier",
    "Franchise",
    "Margin Grid",
    "Landed Cost",
  ]
  let headers = []
  resultColumns.forEach(
    field => headers.push({'label': field, 'value': field })
  )
  return headers
}


