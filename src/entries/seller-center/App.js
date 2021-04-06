import React from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from "../../components/PrivateRoute";
import "./App.less";
import BasicLayout from "../../layouts/BasicLayout";
import AppHeader from "./AppHeader";
import {UserOutlined} from "@ant-design/icons";
import HomePage from "./HomePage";
import OrderDetail from "./OrderDetail";
import OrderList from "./OrderList";
import RefundList from "./RefundList";
import RefundDetail from "./RefundDetail";
import AddressList from "./AddressList";
import ProductList from "./ProductList";
import ProductEdit from "./ProductEdit";
import ShopPageList from "./ShopPageList";
import ShopBasicInfo from "./ShopBasicInfo";
import ShopCategoryList from "./ShopCategoryList";
import ShippingCenter from "./ShippingCenter";
import ShippingMethods from "./ShippingMethods";
import CouponList from "./CouponList";
import FlashSaleList from "./FlashSaleList";

const menus = [
    {
        title: "首页",
        icon: <UserOutlined />,
        link: "/",
        key: "home'"
    },
    {
        title: "订单",
        icon: <UserOutlined />,
        items: [
            {
                title: "订单管理",
                link: "orders",
                key: "orders",
            },
            {
                title: "发货中心",
                link: "shipping_center",
                key: "shipping_center",
            },
            {
                title: "配送方式",
                link: "shipping_methods",
                key: "shipping_methods",
            }
        ]
    },
    {
        title: "商品",
        icon: <UserOutlined />,
        items: [
            {
                title: "商品管理",
                link: "products",
                key: "products",
            },
            {
                title: "新建商品",
                link: "product_edit",
                key: "product_edit",
            }
        ]
    },
    {
        title: "售后",
        icon: <UserOutlined />,
        items: [
            {
                title: "退货退款",
                link: "refunds",
                key: "refunds",
            }
        ]
    },
    {
        title: "营销中心",
        icon: <UserOutlined />,
        items: [
            {
                title: "优惠券",
                link: "coupons",
                key: "coupons",
            },
            {
                title: "限时抢购",
                link: "flash_sales",
                key: "flash_sales",
            }
        ]
    },
    {
        title: "店铺",
        icon: <UserOutlined />,
        items: [
            {
                title: "基本信息",
                link: "shop_basic_info",
                key: "shop_basic_info",
            },
            {
                title: "地址库",
                link: "addresses",
                key: "addresses",
            },
            {
                title: "装修",
                link: "shop_decoration",
                key: "shop_decoration",
            },
            {
                title: "店铺分类",
                link: "shop_categories",
                key: "shop_categories",
            },
        ]
    },
]
const openMenus = menus.map((item, index) => index.toString());

const routes = [
    {
        path: "/",
        exact: true,
        component: <HomePage/>,
    },
    {
        path: "order/:id",
        breadcrumb: ["订单", "订单详情"],
        component: <OrderDetail/>,
        menu: "orders"
    },
    {
        path: "orders",
        breadcrumb: ["订单", "订单管理"],
        component: <OrderList/>,
        menu: "orders"
    },
    {
        path: "shipping_center",
        breadcrumb: ["订单", "发货中心"],
        component: <ShippingCenter/>,
        menu: "shipping_center"
    },
    {
        path: "shipping_methods",
        breadcrumb: ["订单", "配送方式"],
        component: <ShippingMethods/>,
        menu: "shipping_methods"
    },
    {
        path: "refunds",
        breadcrumb: ["售后", "退款/退货"],
        component: <RefundList/>,
        menu: "refunds"
    },
    {
        path: "refund/:id",
        breadcrumb: ["售后", "退款/退货详情"],
        component: <RefundDetail/>,
        menu: "refunds"
    },
    {
        path: "coupons",
        breadcrumb: ["营销中心", "优惠券"],
        component: <CouponList/>,
        menu: "coupons"
    },
    {
        path: "flash_sales",
        breadcrumb: ["营销中心", "限时抢购"],
        component: <FlashSaleList/>,
        menu: "flash_sales"
    },
    {
        path: "addresses",
        breadcrumb: ["店铺", "地址管理"],
        component: <AddressList/>,
        menu: "addresses"
    },
    {
        path: "products",
        breadcrumb: ["商品", "我的商品"],
        component: <ProductList/>,
        menu: "products"
    },
    {
        path: "product_edit",
        breadcrumb: ["商品", "新建商品"],
        component: <ProductEdit/>,
        menu: "product_edit"
    },
    {
        path: "shop_basic_info",
        breadcrumb: ["店铺", "基本信息"],
        component: <ShopBasicInfo/>,
        menu: "shop_basic_info"
    },
    {
        path: "shop_decoration",
        breadcrumb: ["店铺", "装修"],
        component: <ShopPageList/>,
        menu: "shop_decorate"
    },
    {
        path: "shop_categories",
        breadcrumb: ["店铺", "店铺分类"],
        component: <ShopCategoryList/>,
        menu: "shop_categories"
    }
];


export default function App() {
    return (
        <Router>
            <PrivateRoute path="/" authorities="r_seller">
                <BasicLayout menus={menus} openMenus={openMenus} routes={routes} header={<AppHeader/>}/>
            </PrivateRoute>
        </Router>
    );
}


