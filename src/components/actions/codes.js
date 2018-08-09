/**
 * @file Provides methods for adding supplier code updates
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const createCodeColumns = function(state) {
  // check for fields to populate - create if missing
  const addFields = [
    "Last Supplier",
    "Supplier Prod Code",
    "Code",
    "Barcode",
  ]
  const resultColumns = ["Description"]
  resultColumns.push(...addFields)
  let values = []
  resultColumns.forEach(
    field => values.push({'label': field, 'value': field })
  )
  return values
}
