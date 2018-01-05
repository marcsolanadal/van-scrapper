const Nightmare = require('nightmare')

const nightmare = Nightmare({ 
  show: true 
})

const searchTerm = 'iveco daily'
const pages = {
  milanuncios: 'https://www.milanuncios.com/furgonetas-de-segunda-mano'
}

 /*
  * Adapts the information comming from the elements to be managable
  * 
  * { kilometers: '16.000 kms', price: '30.000€', year: 'año 2016' }
  * { kilometers: '16000', price: '30000', year: '2016' }
  */
const dataFromItem = (item) => {
  let data
  Object.keys(item).map(key => {
    if (item[key] !== undefined && item[key] !== null) {
      data[key] = item[key].innerText.replace(/\D/g, '');
    } else {
      data[key] = undefined
    }
  })
  return data
}

const extractDataFromPage = () => {
  return [...document.querySelectorAll('.aditem')].map(el => {

    const dataElements = {
      price: el.querySelector('.aditem-price'),
      year: el.querySelector('.ano'),
      kilometers: el.querySelector('.kms')
    }

    /*
     * Adapts the information comming from the elements to be managable
     * 
     * { kilometers: '16.000 kms', price: '30.000€', year: 'año 2016' }
     * { kilometers: '16000', price: '30000', year: '2016' }
     */
    Object.keys(dataElements).map(key => {
      if (dataElements[key] !== undefined && dataElements[key] !== null) {
        dataElements[key] = dataElements[key].innerText.replace(/\D/g, '');
      } else {
        dataElements[key] = undefined
      }
    })

    return dataElements
  })
}

const getDataFromPage = (searchTerm, page) => {
  return new Promise((resolve, reject) => {
    const url = `${pages.milanuncios}/${searchTerm}.htm?demanda=n&pagina=${page}`
    console.log(url)
    return nightmare
      .wait(1000)
      .goto(url)
      .wait('#searchAdBoxAdCounter')
      .evaluate(() => {
        return [...document.querySelectorAll('.aditem')].map(el => {
          
          const dataElements = {
            price: el.querySelector('.aditem-price'),
            year: el.querySelector('.ano'),
            kilometers: el.querySelector('.kms')
          }
      
          /*
            * Adapts the information comming from the elements to be managable
            * 
            * { kilometers: '16.000 kms', price: '30.000€', year: 'año 2016' }
            * { kilometers: '16000', price: '30000', year: '2016' }
            */
          Object.keys(dataElements).map(key => {
            if (dataElements[key] !== undefined && dataElements[key] !== null) {
              dataElements[key] = dataElements[key].innerText.replace(/\D/g, '');
            } else {
              dataElements[key] = undefined
            }
          })
      
          return dataElements
        })
        
      })
      .then(data => {
        return resolve(data)
      })
      .catch(err => reject(err))
  })
}

/*
const nextPage = async (data, i) => {
  
}
*/

const allPages = () => {
  const formattedSearchTerm = searchTerm.toLowerCase().replace(' ', '-')
  const temp = []

  return [50, 51].reduce((promise, page) => {
    return promise.then((data) => {
      return getDataFromPage(formattedSearchTerm, page).then((item) => {
        return Promise.resolve([...data, ...item])
      })
    })
  }, Promise.resolve([]))
}

nightmare
  .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
  .goto(pages.milanuncios)
  .wait(1000)
  
  .type('#palabras', searchTerm)
  .click('#vamos')
  .wait('#searchAdBoxAdCounter')

  .then(() => fetchPage([], 1))

  .then((res) => {
    console.log('final res', res, res.length)
  })

  .catch((error) => {
    console.error('Search failed:', error);
  });


/*
const fetchData = async (data, page) => {
  if (await isLastPage(page)) return data
  
  const result = await getPageData(page);
  data.push(result)
  
  console.log(`page ${page} data fetched...`)
  
  return fetchData(data, page + 1)
}

fetchData([], 1).then(res => console.log(res))
*/
