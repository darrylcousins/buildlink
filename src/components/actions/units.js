/**
 * @file Provides methods for setting UOM values
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

const UNIT = "UOM"
const DESC = "Description"
const SUPP = "Last Supplier"
const EACH = "Each"
const JAR = "Jar"
const BOX = "Box"
const PKT = "Pkt"
const LM = "LM"
const COUNT_RE = /[(]\b[0-9]+\b[)]?/

class Units {

  existing(unit) {
    if ( unit === "EA" ) {
      return "Each"
    } else if ( unit === "BOX" || unit === "BX" ) {
      return "Box"
    }
    if ( unit.hasOwnProperty("charAt") ) {
      if ( unit.charAt(0) !== "L" ) {
        return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase()
      }
    }
    return ""
  }

  sheet(desc) {
    desc = desc.toLowerCase()
    if ((desc.includes("plywood") || desc.includes("gib") || desc.includes("mdf"))
      && (desc.includes("1200") || desc.includes("1220"))) return "Sheet"
    return null
  }

  ALLTOO(desc) {
    return EACH
  }

  CEMLTD(desc) {
    return EACH
  }

  HAYBRU(desc) {
    desc = desc.toLowerCase()
    if (desc.includes("pack")) return "Pack"
    return EACH
  }

  HOLNEW(desc) {
    return EACH
  }

  PFGLOBAL(desc) {
    return EACH
  }

  MITBRO(desc) {
    desc = desc.toLowerCase()
    if (desc.includes("palings")) return EACH
    if (desc.includes("rails")) return LM
  }

  MITLTD(desc) {
    const re = /\b[1-9][0]+[ba]?[g]\b/
    if (re.test(desc)) return "Bag"
    return EACH
  }

  MSL(desc) {
    if (desc.includes(JAR) || desc.includes("Rivets")) return JAR
    if (desc.includes(BOX) || desc.includes(PKT)) return BOX
    if (desc.includes("Pack")) return "Pack"
    const match = desc.match(COUNT_RE)
    if ( match !== null ) {
      let count = match[0].length
      return count > 5 ? BOX : JAR
    }
    return EACH
  }

  SAIGOB(desc) {
    return EACH
  }

  SIKNEW(desc) {
    return EACH
  }

  SOUPIN(desc) {
    return EACH
  }

  TOOSAL(desc) {
    return EACH
  }

  UNISTE(desc) {
    desc = desc.toLowerCase()
    if (desc.includes("bundle")) return "Bundle"
    return EACH
  }

}

export const setUnits = function(state) {
  const { data } = state
  let setUnit = new Units()
  data.forEach(
    (row, idx) => {
      const unit = data[idx]["Unit"]
      const desc = row[DESC]
      if (unit !== undefined && unit !== null ) data[idx][UNIT] = setUnit.existing(unit)
      if (setUnit.sheet(desc)) data[idx][UNIT] = setUnit.sheet(desc)
      if (typeof setUnit[row[SUPP]] === 'function') data[idx][UNIT] = setUnit[row[SUPP]](desc)
    }
  )
}
