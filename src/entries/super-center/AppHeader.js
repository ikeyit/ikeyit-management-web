import React, {useContext} from "react";
import {SessionContext} from "../../components/SessionContext";
import {Link, useRouteMatch} from "react-router-dom";

export default function AppHeader() {
    const {auth, logout} = useContext(SessionContext);
    const {path} = useRouteMatch();
    return (
        <div className="site-header">
            <div className="site-header-left">
                <Link to={path}><img src="logo-header.png"/>平台管理中心</Link>
            </div>
            <div className="site-header-middle">

            </div>
            <div className="site-header-right">
                <span>{auth.user.nick}</span>
                <a onClick={logout}>注销</a>
            </div>
        </div>

    );
}