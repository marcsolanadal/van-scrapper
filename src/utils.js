const arrayToObject = (arr) => {
  return arr.reduce((acc, curr, i) => {
    acc[i] = curr
    return acc
  }, {})
}

const offsetKeys = (obj, offset) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[parseInt(key) + offset] = obj[key]
    return acc
  }, {})
}

module.exports = {
  arrayToObject,
  offsetKeys
}
