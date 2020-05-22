'use strict';

const chromium = require('chrome-aws-lambda');
const matrix = require('matrix-js-sdk');

module.exports.autoconfirm = async event => {
  let matrixClient

  if ("MATRIX_TOKEN" in process.env &&
    "MATRIX_USER" in process.env &&
    "MATRIX_ROOM" in process.env) {
    matrixClient = matrix.createClient({
      baseUrl: "https://matrix.org",
      accessToken: process.env.MATRIX_TOKEN,
      userId: process.env.MATRIX_USER
    });
    console.log("Matrix client created")
  } else {
    console.log("Matrix client not created")
  }

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto('https://happycard.force.com/SiteLogin');
  const loginSelector = '#loginPage\\:SiteTemplate\\:formulaire\\:login-field';
  const pwdSelector = '#loginPage\\:SiteTemplate\\:formulaire\\:password-field';

  await page.waitForSelector(loginSelector)
  await page.waitForSelector(pwdSelector)

  await page.type(loginSelector, process.env.TGVMAX_LOGIN)
  await page.type(pwdSelector, process.env.TGVMAX_PWD)

  await page.click(".link-container > input:nth-child(1)")

  await page.waitFor(10000)
  const travelSelector = "div.container:nth-child(2) .travel"

  const confirmedTravels = []
  await page.waitForSelector(travelSelector)
  const travels = await page.$$(travelSelector);

  for (const travel of travels) {
    let od = await travel.$eval(".travel-od", (element) => {
      return element.innerText
    })

    let departure = await travel.$eval("#departureDateTime", (element) => {
      return element.innerText
    })

    let button = await travel.$(".confirm-actif")
    if (button != null) {
      await button.click()
      confirmedTravels.push(od + " -> " + departure)

      const content = {
        "body": "🚆 Le trajet suivant est confirmé 🚆\n" + od + "\n" + departure,
        "msgtype": "m.text"
      };
      if (matrixClient != null) {
        matrixClient.sendEvent("!aCsiZJTqtlxczYpUNe:matrix.org", "m.room.message", content, "", (err, res) => {
          console.log(err);
        });
      }
    }
  }
  await page.waitFor(1000)
  await browser.close()

  return confirmedTravels
};
