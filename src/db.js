const firebase = require('firebase')
const { normalizeById } = require('./utils')

const setPage = async (page) => {
  await firebase.database().ref('/page').set(page)
}

const setVans = async (vans) => {
  const vansRef = firebase.database().ref('/vans')
  const snapshot = await vansRef.once('value')

  const nextVans = (snapshot.exists())
    ? Object.assign(snapshot.val(),  normalizeById(vans))
    : normalizeById(vans)

  vansRef.set(nextVans)
}

module.exports = {
  setPage,
  setVans
}
