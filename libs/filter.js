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
    //if list is not an array
    data.map(obj => {
      obj[list] = undefined
    })
  }

  return data
}

module.exports = filter