const url = 'https://www.milanuncios.com/furgonetas-de-segunda-mano'

const formatSearch = (str) => {
  return str.toLowerCase().replace(' ', '-')
}

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

module.exports = {
  url,
  formatSearch,
  getPageData,
}
