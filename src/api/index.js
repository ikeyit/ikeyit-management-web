import {passportUrl, productUrl, tradeUrl} from "./apiConfig";
import {callApi, callGet, callPost, callPut, callDelete} from "./callApi";

/**以下为业务API**/
export const
    getHomeStats = callGet(`${tradeUrl}/seller/home_stats`),

    //CMS
    getPosts = callGet(`${productUrl}/posts/user`),
    getPost = callGet(`${productUrl}/post/{id}`),
    createPost = callPost(`${productUrl}/post`),
    updatePost = callPut( `${productUrl}/post/{id}`),

    //店铺装修
    getShopPages = callGet(`${productUrl}/seller/shop_pages`),
    getShopPage = callGet(`${productUrl}/seller/shop_page/{id}`),
    createShopPage = callPost(`${productUrl}/seller/shop_page`),
    updateShopPage = callPut(`${productUrl}/seller/shop_page/{id}`),

    //店铺设置
    getShopBasicInfo = callGet(`${productUrl}/seller/shop_basic_info`),
    updateShopBasicInfo = callPut(`${productUrl}/seller/shop_basic_info`),

    //店铺分类
    getShopCategories = callGet(`${productUrl}/seller/shop_categories`),
    createShopCategory = callPost(`${productUrl}/seller/shop_category`),
    updateShopCategory = callPut(`${productUrl}/seller/shop_category/{id}`),
    deleteShopCategory = callDelete(`${productUrl}/seller/shop_category/{id}`),
    getShopCategoryProducts = callGet(`${productUrl}/seller/shop_category_products`),
    addProductIntoShopCategory = callPost(`${productUrl}/seller/shop_category_product`),
    removeProductIntoShopCategory = callDelete(`${productUrl}/seller/shop_category_product`),
    orderShopCategories = callPut(`${productUrl}/seller/shop_category/order`),

    //卖家地址管理
    getSellerAddresses = callGet(`${tradeUrl}/seller/addresses`),
    getDefaultReturnToAddress = callGet(`${tradeUrl}/seller/address/default_return_to`),
    deleteSellerAddress = callDelete(`${tradeUrl}/seller/address/{id}`),

    //订单相关
    getOrder = callGet(`${tradeUrl}/seller/order/{id}`),
    getOrders = callGet(`${tradeUrl}/seller/orders`),
    shipOrder = callPost(`${tradeUrl}/seller/order/{id}/ship`),

    //退货退款
    getRefunds = callGet(`${tradeUrl}/seller/refunds`),
    getRefund = callGet(`${tradeUrl}/seller/refund/{id}`),
    rejectRefund = callPost(`${tradeUrl}/seller/refund/{id}/reject`),
    agreeRefund = callPut(`${tradeUrl}/seller/refund/{id}/agree_refund`),
    agreeReturn = callPut(`${tradeUrl}/seller/refund/{id}/agree_return`),

    //商品
    getProducts = callGet(`${productUrl}/seller/products`),
    getProduct = callGet(`${productUrl}/seller/product/{id}`),
    createProduct = callPost(`${productUrl}/seller/product`),
    updateProduct = callPut( `${productUrl}/seller/product/{id}`),
    setProductOnSale = callPut(`${productUrl}/seller/product/{id}/on_sale`),
    setProductOffSale = callPut(`${productUrl}/seller/product/{id}/off_sale`),

    //媒体管理
    createMedia = callPost(`${productUrl}/seller/media`),
    getMedias = callGet(`${productUrl}/seller/medias`),
    prepareUploadImage = callGet(`${productUrl}/prepare_upload/image`),


    //平台管理
    //类目管理
    getCategories = callGet(`${productUrl}/categories`),
    getCategoryAttributes = callGet(`${productUrl}/category/{id}/attributes`),
    getCategoryAttributeValues = callGet(`${productUrl}/category/{id}/attribute_values`),
    getAllCategories = callGet(`${productUrl}/categories/all`),
    obsoleteCategory = callDelete( `${productUrl}/category/{id}`),
    createCategory = callPost(`${productUrl}/category`),
    updateCategory = callPut(`${productUrl}/category/{id}`),
    getCategory = callGet( `${productUrl}/category/{id}`),
    getCategoryPath = callGet(`${productUrl}/category/{id}/path`),
    getCategoryDetail = callGet(`${productUrl}/category/{id}/detail`),
    updateCategoryAttributes = callPut( `${productUrl}/category/{id}/attributes`),
    getAttributes = callGet(`${productUrl}/attributes`),
    getAttribute = callGet(`${productUrl}/attribute/{id}`),
    obsoleteAttribute = callDelete(`${productUrl}/attribute/{id}`),
    createAttribute = callPost(`${productUrl}/attribute`),
    updateAttribute = callPut(`${productUrl}/attribute/{attributeId}`),

    //微信客户端管理
    getWeixinClients = callGet(`${passportUrl}/super/weixin_clients`),
    createWeixinClient = callPost(`${passportUrl}/super/weixin_client`),
    updateWeixinClient = callPut(`${passportUrl}/super/weixin_client/{appId}`),
    deleteWeixinClient = callDelete(`${passportUrl}/super/weixin_client/{appId}`),

    //平台管理用户
    getUsers = callGet(`${passportUrl}/super/users`),
    setUsersEnabled = callPut(`${passportUrl}/super/users/enabled`),

    //账户中心
    getUser = callGet(`${passportUrl}/account/user`),
    sendVerificationCodeForCheckSecurity = callPost(`${passportUrl}/account/security_check/verification/{way}`),
    checkSecurity = callPost(`${passportUrl}/account/security_check`),
    sendVerificationCodeForUpdateEmail = callPost(`${passportUrl}/account/email/verification`),
    updateEmail = callPost(`${passportUrl}/account/email`),
    updatePassword = callPost(`${passportUrl}/account/password`),
    sendVerificationCodeForUpdateMobile = callPost(`${passportUrl}/account/mobile/verification`),
    updateMobile = callPost(`${passportUrl}/account/mobile`)
;


export function updateSellerMemo(params) {
    return callApi({
        method: 'post',
        url: `${tradeUrl}/seller/order/${params.id}/memo`,
        data: new URLSearchParams(params)
    });
}

export function addSellerAddress(params){
    return callApi({
        method: 'post',
        url: `${tradeUrl}/seller/address`,
        data: new URLSearchParams(params),
    });
}

export function updateSellerAddress(params){
    return callApi({
        method: 'put',
        url: `${tradeUrl}/seller/address/${params.id}`,
        data: new URLSearchParams(params),
    });
}
