export let passportUrl = "http://localhost:9000";
export let userUrl = "http://localhost:9000";
export let messageCenterUrl = "http://localhost:9000";
export let messageCenterWSUrl = "ws://localhost:9000";
export let productUrl = "http://localhost:9001";
export let tradeUrl = "http://localhost:9002";

let env = process.env.NODE_ENV
console.info(`current env: ${env}`);
if (env === 'production') {
    passportUrl = "https://ikeyit.xyz/passport";
    userUrl = `${passportUrl}`;
    messageCenterUrl = `${passportUrl}`;
    messageCenterWSUrl = "ws://ikeyit.xyz/passport";
    productUrl = "https://ikeyit.xyz/product";
    tradeUrl = "https://ikeyit.xyz/trade";
} 
