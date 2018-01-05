const puppeteer = require('puppeteer');

const searchTerm = 'iveco daily';
const pages = {
  milanuncios: 'https://www.milanuncios.com'
};

(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  }); 
  
  const page = await browser.newPage();
  await page.goto(pages.milanuncios);

  await page.click('searchInput input')


  //await page.click('#cuerpo > div:nth-child(3) > div.aditem-detail-image-container > div.aditem-detail > a')

  //await page.click('#palabras');
  //await page.keyboard.type(searchTerm);
  
  //await page.click('#vamos');  
  //await page.waitForNavigation();

  //await page.screenshot({ path: 'example.png' });
})();