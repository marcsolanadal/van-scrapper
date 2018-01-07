const firebase = require('firebase')
const { arrayToObject, offsetKeys } = require('./utils')

const setPage = async (page) => {
  await firebase.database().ref('/page').set(page)
}

const setVans = async (vans) => {
  const vansRef = firebase.database().ref('/vans');
  const snapshot = await vansRef.once('value')

  let nextVans
  if (snapshot.exists()) {
    const currentVans = snapshot.val()
    const offset = Object.keys(currentVans).length
    const newVans = offsetKeys(arrayToObject(vans), offset)
    nextVans = Object.assign(currentVans, newVans)
  } else {
    nextVans = vans
  }

  vansRef.set(nextVans)
}

module.exports = {
  setPage,
  setVans
}
