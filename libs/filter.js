/**
 * Filter Object
 * @param {Object} data 
 * @param {Array} list 
 */
let filter = (data, list) => {
  try {
    list.map(l => {
      data.map(obj => {
        obj[l] = undefined
      })
    })
  } catch (e) {
    try {
      //if list is not an array
      data.map(obj => {
        obj[list] = undefined
      })
    } catch (e) {
      //if data is not an array
      list.map(l => {
        data[l] = undefined
      })
    }
  }

  return data
}

module.exports = filter