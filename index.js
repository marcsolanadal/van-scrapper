const Nightmare = require('nightmare')
const _ = require('lodash')

const milanuncios = require('./websites/milanuncios')

const nightmare = Nightmare({ 
  show: true 
})

const searchTerm = 'iveco daily'

const fetchDataFromPages = (data, page) => {
  const formattedSearch = milanuncios.formatSearch(searchTerm)
  const url = `${milanuncios.url}/${formattedSearch}.htm?demanda=n&pagina=${page}`

  return nightmare
    .goto(url)
    .evaluate(milanuncios.getPageData)
    .then(({ lastPage, pageData }) => {
      if (lastPage) { 
        return data 
      } else {
        return fetchDataFromPages([...data, ...pageData], page + 1)        
      }
    })
}

const getData = (website) => {
  return nightmare
    .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
    .goto(website.url)
    .wait('#vamos')
    
    .insert('#palabras', searchTerm)
    .click('#vamos')
    .wait('#searchAdBoxAdCounter')

    .then(() => fetchDataFromPages([], 1))

    .then((results) => {
      const filteredData = results.filter(item => item.kilometers && item.price)
      const finalData = _.uniqWith(filteredData, _.isEqual)
      console.log('final data', finalData, finalData.length)
      return finalData
    })

    .catch((err) => {
      console.error('Search failed:', err);
    })
}

getData(milanuncios)
