/**
 * @file Provides methods for updating descriptions
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

export const createDescriptionColumns = function(state) {
  // check for fields to populate - create if missing
  const addFields = [
    "Long Description 1",
  ]
  const resultColumns = ["Code", "Description"]
  resultColumns.push(...addFields)
  let values = []
  resultColumns.forEach(
    field => values.push({'label': field, 'value': field })
  )
  return values
}

