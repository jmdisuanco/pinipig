/**
 * Filter Object
 * @param {Object} data 
 * @param {Array} list 
 */
let filterProcess = (data, list) => {
  if (data) {
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
}


let filterSetter = filter => (ctx) => {
  ctx.options = {
    filter: filter
  }
  return ctx
}

module.exports = {
  filterProcess,
  filter: filterSetter

}