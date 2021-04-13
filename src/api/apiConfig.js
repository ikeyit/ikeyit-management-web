export let passportUrl = "http://localhost:9000";
export let userUrl = "http://localhost:9000";
export let messageCenterUrl = "http://localhost:9000";
export let messageCenterWSUrl = "ws://localhost:9000";
export let productUrl = "http://localhost:9001";
export let tradeUrl = "http://localhost:9002";

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
