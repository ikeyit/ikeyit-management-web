import React, {useContext} from "react";
import {SessionContext} from "../../components/SessionContext";
import {Link, useRouteMatch} from "react-router-dom";
import MessageBox from "./MessageBox";
import {Menu, Dropdown} from "antd";
import {DownOutlined} from "@ant-design/icons";
import  "./AppHeader.less";

export default function AppHeader() {
    const {auth, logout} = useContext(SessionContext);
    const {path} = useRouteMatch();
    const menu = (
        <Menu>
            <Menu.Item key="account-info">
                <span className="account-info">账号ID: {auth.user.id}</span>
            </Menu.Item>
            <Menu.Item key="account-center">
                <a target="_blank" href="/account-center.html">账号管理</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={logout}>退出</Menu.Item>
        </Menu>
    );

    return (
        <div className="site-header">
            <div className="site-header-left">
                <Link to={path}><img src="logo-header.png"/>商家中心</Link>
            </div>
            <div className="site-header-middle">
            </div>
            <div className="site-header-right">
                <MessageBox/>
                <Dropdown overlay={menu}>
                    <div className="site-header-account">
                        <img src={auth.user.avatar}  className="left"/>
                        <span className="middle">{auth.user.nick}</span>
                        <span className="right"> </span>
                    </div>
                </Dropdown>
            </div>
        </div>

    );
}