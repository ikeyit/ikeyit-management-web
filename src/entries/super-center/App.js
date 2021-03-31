import React from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from "../../components/PrivateRoute";
import "./App.less";
import BasicLayout from "../../layouts/BasicLayout";
import AppHeader from "./AppHeader";
import {UserOutlined} from "@ant-design/icons";
import CategoryList from "./CategoryList";
import CategoryAttributesEdit from "./CategoryAttributesEdit";
import AttributeList from "./AttributeList";
import AttributeEdit from "./AttributeEdit";
import WeixinClientList from "./WeixinClientList";


const menus = [
    {
        title: "客户端管理",
        icon: <UserOutlined />,
        items: [
            {
                title: "微信客服端管理",
                link: "/weixin_clients",
                key: "weixin_clients",
            }
        ]
    },

    {
        title: "类目",
        icon: <UserOutlined />,
        items: [
            {
                title: "分类管理",
                link: "/categories",
                key: "categories",
            },
            {
                title: "参数管理",
                link: "/attributes",
                key: "attributes",
            }
        ]
    },

]
const openMenus = menus.map((item, index) => index.toString());

const routes = [
    {
        path: "/",
        exact: true,
        component: <div>未实现</div>,
    },
    {
        path: "/weixin_clients",
        breadcrumb: ["客服端管理", "微信客户端"],
        component: <WeixinClientList/>,
        menu: "weixin_clients"
    },

    {
        path: "/categories",
        breadcrumb: ["类目", "类目管理"],
        component: <CategoryList/>,
        menu: "categories"
    },
    {
        path: "/category_attributes",
        breadcrumb: ["类目", "类目管理"],
        component: <CategoryAttributesEdit/>,
        menu: "categories"
    },
    {
        path: "/attributes",
        breadcrumb: ["类目", "参数管理"],
        component: <AttributeList/>,
        menu: "attributes"
    },
    {
        path: "/attribute_edit",
        exact: true,
        breadcrumb: ["类目", "参数管理"],
        component: <AttributeEdit/>,
        menu: "attributes"
    },
];

export default function App() {
    return (
        <Router>
            <PrivateRoute path="/" authorities="ROLE_SELLER">
                <BasicLayout menus={menus} openMenus={openMenus} routes={routes} header={<AppHeader/>}/>
            </PrivateRoute>
        </Router>
    );
}


