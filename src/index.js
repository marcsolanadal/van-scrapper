const firebase = require('firebase')
const milanuncios = require('./bots/milanuncios')

const scrapper = milanuncios('iveco daily')

const config = {
  apiKey: "AIzaSyBFOox36Tc6-zSxs83A6LBlXr6sctChwz8",
  authDomain: "van-finder-bot.firebaseapp.com",
  databaseURL: "https://van-finder-bot.firebaseio.com",
  projectId: "van-finder-bot",
  storageBucket: "",
  messagingSenderId: "272540038382"
}

const initializeUser = async (user, scrape) => {
  if (user) {
    var uid = user.uid
    console.log(`User ${uid} signed in...`)

    await scrape()

    await firebase.auth().signOut()
    console.log(`User ${uid} logged out...`)

    process.exit()
  }
}

(async () => {
  firebase.initializeApp(config)

  await firebase.auth().signInAnonymously()
  await firebase.auth().onAuthStateChanged((user) => {
    initializeUser(user, scrapper)
  })

})()
