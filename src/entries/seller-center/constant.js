export const ORDER_STATUS = {
    WAIT_BUYER_PAY: 10,
    CLOSED: 20,
    PAID: 30,
    SHIPPED: 70,
    FINISHED: 90,
}

export const ORDER_STATUS_TEXT = {
    [ORDER_STATUS.WAIT_BUYER_PAY]: "等待付款",
    [ORDER_STATUS.CLOSED]: "已关闭",
    [ORDER_STATUS.PAID]: "已付款",
    [ORDER_STATUS.SHIPPED]: "已发货",
    [ORDER_STATUS.FINISHED]: "已完成",
}

export const ORDER_CLOSE_REASON = {
    1 : "超时取消",
    2 : "用户主动取消",
}


/**退款常量**/
export const REFUND_STATUS = {
    WAIT_SELLER_AGREE: 1,
    WAIT_BUYER_RETURN_GOODS: 2,
    WAIT_SELLER_CONFIRM_GOODS: 3,
    SELLER_REFUSE_BUYER: 4,
    SELLER_AGREED_REFUND: 5,
    REFUNDING: 6,
    CLOSED: 7,
    SUCCESS: 8,
}

export const REFUND_STATUS_TEXT = {
    [REFUND_STATUS.WAIT_SELLER_AGREE]: "等待卖家审核退款",
    [REFUND_STATUS.WAIT_BUYER_RETURN_GOODS]: "等待买家寄回商品",
    [REFUND_STATUS.WAIT_SELLER_CONFIRM_GOODS]: "等待卖家收货",
    [REFUND_STATUS.SELLER_REFUSE_BUYER]: "卖家拒绝退款",
    [REFUND_STATUS.SELLER_AGREED_REFUND]: "卖家同意退款",
    [REFUND_STATUS.REFUNDING]: "退款中",
    [REFUND_STATUS.CLOSED]: "退款关闭",
    [REFUND_STATUS.SUCCESS]: "退款成功",
}

export const REFUND_TYPE = {
    RETURN_REFUND: 1,
    ONLY_REFUND: 2,
}

export const REFUND_TYPE_TEXT = {
    [REFUND_TYPE.RETURN_REFUND]: "退货退款",
    [REFUND_TYPE.ONLY_REFUND]: "仅退款",
}





export const PRODUCT_STATUS = {
    OFF_SALE: 0,
    ON_SALE: 1,
    SOLD_OUT: 2,
    DELETED: 4,
    0 : "已下架",
    1 : "售卖中",
    2 : "已售罄",
    4 : "已删除"
}

export const MESSAGE_TYPE = {
    TRADE: 1,
    SYSTEM: 2,
    SHOP: 3
}

MESSAGE_TYPE[MESSAGE_TYPE.TRADE] = "交易消息";
MESSAGE_TYPE[MESSAGE_TYPE.SYSTEM] = "系统消息";
MESSAGE_TYPE[MESSAGE_TYPE.SHOP] = "店铺消息";


export const MESSAGE_STATUS = {
    UNREAD: 0,
    READ: 1,
}

