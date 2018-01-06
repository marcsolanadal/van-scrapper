
const url = 'https://www.milanuncios.com/furgonetas-de-segunda-mano'

const formatSearch = (str) => {
  return str.toLowerCase().replace(' ', '-')
}

/*
 * Gets elements containing wanted data and extracts it
 * 
 * { kilometers: '16.000 kms', price: '30.000€', year: 'año 2016' }
 * { kilometers: '16000', price: '30000', year: '2016' }
 */

const getPageData = () => {
  return {
    lastPage: document.querySelector('#cuerpo > div.nohayanuncios') !== null,
    pageData: [...document.querySelectorAll('.aditem')].map(el => {
      
      const dataElements = {
        price: el.querySelector('.aditem-price'),
        year: el.querySelector('.ano'),
        kilometers: el.querySelector('.kms')
      }
  
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
}

module.exports = {
  url,
  formatSearch,
  getPageData
}
