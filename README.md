## Coco

## Prerequsite

- NodeJS >= v12.18.3
- mongoDB >= v4.2.3

## Installation

1. clone repo
```
$ git clone https://github.com/yudizaxay/Coco.git
```
2. create `.env` file 
3. add following data:
```
# DB connection
DB_URL = your connection string

# CLOUDINARY CONFIGURATION
CLOUD_NAME = cloud name
CLOUD_API_KEY = cloud api key	
CLOUD_API_SECRET = cloud secret key

NETWORK_RPC_URL = https://data-seed-prebsc-1-s1.binance.org:8545/
```
4. install node modules
```
$ npm i
```
5. start web server
```
$ npm start
```
6. server will start on port `6001`(default).

7. Start NFT tracker
```
$ node tracker.js
```