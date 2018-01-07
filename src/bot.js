const Nightmare = require('nightmare')
const _ = require('lodash')
const { setPage, setVans } = require('./db')
const milanuncios = require('./websites/milanuncios')

const nightmare = Nightmare({ 
  show: true,
  /*
  openDevTools: {
    mode: 'right'
  }
  */
})

Nightmare.action('scrollIntoView', function (selector, done) {
  this.evaluate_now((selector) => {
    document.querySelector(selector).scrollIntoView(true)
  }, done, selector)
})

const fetchDataFromPages = (data, page, search) => {
  const formattedSearch = milanuncios.formatSearch(search)
  const url = `${milanuncios.url}/${formattedSearch}.htm?demanda=n&pagina=${page}`

  return nightmare
    .goto(url)
    .scrollIntoView('.adlist-paginator-box')
    .wait(5000)
    .evaluate(milanuncios.getPageData)
    .then(async ({ lastPage, pageData }) => {

      await setVans(filterData(pageData))
      await setPage(page)
      console.log(`vans for page ${page} have been saved...`)

      /*
      if (lastPage) { 
        return data 
      } else {

        // Submit data to firebase with the page
        // TODO: we need to store the last page just to continue from that page in case we
        // hit a capcha wall

        return fetchDataFromPages([...data, ...pageData], page + 1)        
      }
      */
    })
}

const filterVans = (van) => {
  return van.kilometers && van.price && van.images
}

const filterData = (data) => {
  return _.uniqWith(data.filter(filterVans), _.isEqual)
}

module.exports = (website, search) => {
  return async () => {

    return nightmare
    .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
    .goto(website.url)
    .wait('#vamos')
    
    .insert('#palabras', search)
    .click('#vamos')
    .wait('#searchAdBoxAdCounter')

    .then(() => fetchDataFromPages([], 1, search))

    .catch((err) => {
      console.error(err);
    })

  }
}

/*
module.exports = async (website) => {
  return nightmare
    .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
    .goto(website.url)
    .wait('#vamos')
    
    .insert('#palabras', searchTerm)
    .click('#vamos')
    .wait('#searchAdBoxAdCounter')

    .then(() => fetchDataFromPages([], 1))

    .catch((err) => {
      console.error(err);
    })
}
*/
