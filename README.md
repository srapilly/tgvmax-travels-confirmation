![Deploy AWS Lambda](https://github.com/varsq/tgvmax-aws-lambda-confirmation/workflows/Deploy%20AWS%20Lambda/badge.svg)

#### What is it ?

Deploy an AWS lambda that automatically confirm [TGVmax](https://www.tgvmax.fr/VSC/fr-FR) travels every 10 hours

**Only confirm trainline travels for now**

The following env variable needs to be set in gitlab secret:
- TGVMAX_LOGIN
- TGVMAX_PWD
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

Optionally the following env variable can be used to send a notification to a [matrix](https://matrix.org/) room
- MATRIX_TOKEN (can be found in Help&About -> Advanced in riot.im settings)
- MATRIX_USER (ex: @abcdef:matrix.org)
- MATRIX_ROOM (can be found in Advanced -> Room Information in riot.im room settings)

#### What does it uses ?

- [serveless](https://github.com/serverless/serverless) for deploying the lambda, config can be changed in serverless.yml file
- [puppeteer](https://github.com/puppeteer/puppeteer/) for browser automation 
- [matrix-js-sdk](https://github.com/matrix-org/matrix-js-sdk) for sending a notification





