const Nightmare = require('nightmare')
const _ = require('lodash')
const { setPage, setVans } = require('../db')

const nightmare = Nightmare({ 
  show: true
})

Nightmare.action('scrollIntoView', function (selector, done) {
  this.evaluate_now((selector) => {
    document.querySelector(selector).scrollIntoView(true)
  }, done, selector)
})

const url = 'https://www.milanuncios.com/furgonetas-de-segunda-mano'

const getPageData = () => {

  const innerText = (el) => el.innerText
  const getNumeric = (str) => str.replace(/\D/g, '')
  const noop = (str) => str

  const dataFields = {
    price: {
      selector: '.aditem-price',
      getData: innerText,
      format: getNumeric
    },
    year: {
      selector: '.ano',
      getData: innerText,
      format: getNumeric
    },
    kilometers: {
      selector: '.kms',
      getData: innerText,
      format: getNumeric
    },
    location: {
      selector: '.aditem-header > .x4',
      getData: innerText,
      format: (str) => {
        return str
          .toLowerCase()
          .split('furgonetas en ')
          .pop()                    // getting only useful info
          .split('(')[0]            // getting city only
          .replace(/[^\w\s]/gi, '') // non alphanumeric characters
          .replace(/  +/g, ' ')     // double spaces
          .trim()                   // space at end of line
      }
    },
    timePosted: { 
      selector: '.aditem-header > .x6',
      getData: innerText,
      format: noop
    },
    images: {
      selector: '.aditem-image > a',
      getData: (el) => el.href,
      format: (str) => {

        const data = str
          .split('openImageDialog')
          .pop()
          .replace(/[\(\)\;\']/gi, '')
          .split(',')

        const photoNumber = data[2].split('')
        const id = data[0]
        const uri = 'https://imgredirect.milanuncios.com'
        
        return photoNumber.map((i) => {
          return `${uri}/fg/${id.slice(0, 4)}/${id.slice(4, 6)}/${id}_${i}.jpg`
        })
      }
    }
  }

  return {
    lastPage: document.querySelector('#cuerpo > div.nohayanuncios') !== null,
    pageData: [...document.querySelectorAll('.aditem')].map(el => {
      return Object.keys(dataFields).reduce((acc, key) => {
        const { selector, getData, format } = dataFields[key]
        const element = el.querySelector(selector)

        if (element) {
          return Object.assign(acc, { 
            [key]: format(getData(element)) 
          })
        }

        return acc
      }, {})
    })
  }
}

const fetchDataFromPages = (data, page, formattedSearch) => {
  const pageUrl = `${url}/${formattedSearch}.htm?demanda=n&pagina=${page}`

  return nightmare
    .goto(pageUrl)
    .scrollIntoView('.adlist-paginator-box')
    .wait(3000)
    .evaluate(getPageData)
    .then(async ({ lastPage, pageData }) => {

      if (lastPage) {
        nightmare.end()
      } else {
        await setVans(filterData(pageData))
        await setPage(page)
        console.log(`vans for page ${page} have been saved...`)

        return fetchDataFromPages([...data, ...pageData], page + 1, formattedSearch)
      }

    })
}

const filterVans = (van) => {
  return van.kilometers && van.price && van.images
}

const filterData = (data) => {
  return _.uniqWith(data.filter(filterVans), _.isEqual)
}

module.exports = (search) => {
  const formattedSearch =  search.toLowerCase().replace(' ', '-')

  return async () => {
    return nightmare
      .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
      .goto(url)
      .wait('#vamos')
      
      .insert('#palabras', search)
      .click('#vamos')
      .wait('#searchAdBoxAdCounter')

      .then(() => fetchDataFromPages([], 32, formattedSearch))

      .catch((err) => {
        console.error(err);
      })
  }
}
