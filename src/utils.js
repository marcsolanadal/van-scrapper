const arrayToObject = (arr) => {
  return arr.reduce((acc, curr, i) => {
    acc[i] = curr
    return acc
  }, {})
}

const normalizeById = (arr) => {
  return arr.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: {
        ...curr
      }
    }
  }, {})
}

module.exports = {
  arrayToObject,
  normalizeById
}
