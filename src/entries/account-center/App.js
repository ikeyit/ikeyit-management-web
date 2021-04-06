import React from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from "../../components/PrivateRoute";
import "./App.less";
import BasicLayout from "../../layouts/BasicLayout";
import AppHeader from "./AppHeader";
import BasicInfoSetting from "./BasicInfoSetting";
import LoginRecords from "./LoginRecords";

const menus = [
    {
        title: "基本信息",
        link: "",
        key: "home'"
    },
    {
        title: "登录记录",
        link: "login_records",
        key: "login_records'"
    },
]

const routes = [
    {
        path: "",
        exact: true,
        component: <BasicInfoSetting/>,
    },
    {
        path: "login_records",
        exact: true,
        component: <LoginRecords/>,
    },

];

export default function App() {
    return (
        <Router>
            <PrivateRoute path="/">
                <BasicLayout menus={menus} routes={routes} header={<AppHeader/>}/>
            </PrivateRoute>
        </Router>
    );
}


