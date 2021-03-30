export let passportUrl = "http://passport-service.ikeyit:9000";
export let userUrl = "http://passport-service.ikeyit:9000";
export let messageCenterUrl = "http://passport-service.ikeyit:9000";
export let messageCenterWSUrl = "ws://passport-service.ikeyit:9000";
export let productUrl = "http://product-service.ikeyit:9001";
export let tradeUrl = "http://trade-service.ikeyit:9002";

let env = process.env.NODE_ENV
console.info(`current env: ${env}`);
if (env === 'production') {
    passportUrl = "https://www.bragood.com/passport";
    userUrl = `${passportUrl}`;
    messageCenterUrl = `${passportUrl}`;
    messageCenterWSUrl = "ws://www.bragood.com/passport";
    productUrl = "https://www.bragood.com/product";
    tradeUrl = "https://www.bragood.com/trade";
} 
