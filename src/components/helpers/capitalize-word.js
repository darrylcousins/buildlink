/**
 * @file Provides `capitalizeWord` method
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

// Capture any words in all caps, also capture start and end parenthesis if they
const ALLCAPS_RE = /[(]?\b[A-Z][A-Z]+\b[)]?/

// Capture words that contain quantity abbreviations, like 90KG, 12MM etc.
const QUANT_RE= /\b[0-9/]*[BXMKLG][XMLG]?[0-9]*\b/

// Capture bolt sizes M12 etc and leave alone
const BOLT_RE= /\b[M][0-9]+\b/

// define set of vowel characters
const VOWELS = new Set('aeiou'.split(''))

export const capitalizeWord = function(value) {
  const exceptions = {
            'X': 'x',
            'BX': 'bx',
            'TE': 'TE',
            'SE': 'SE',
            'LTD': 'Ltd',
            'PER': 'per',
            }

  // cover simple exceptions
  if (value in exceptions) return exceptions[value]

  // split and rejoin words that contain a /, e.g. BRACE/NOISE
  if (value.indexOf('/') !== -1) {
    return value.split('/').map(
      s => capitalizeWord(s)
    ).join('/')
  }

  /*
   * replace value with lower case and return
   */

  // ignore anything without a vowel, e.g. DTS
  let str_set = new Set(value.split(''))
  let intersection = new Set(
      [...str_set].filter(x => VOWELS.has(x.toLowerCase()))
    )

  if (intersection.size > 0) {
    if ( ALLCAPS_RE.test(value) ) return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  } else {
    if ( BOLT_RE.test(value) ) return value
    if ( QUANT_RE.test(value) ) return value.toLowerCase()
  }

  // no matches, return value as it is
  return value
}

