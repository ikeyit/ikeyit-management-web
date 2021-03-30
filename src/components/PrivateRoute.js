import React, {useContext} from 'react'
import {Route} from "react-router-dom";
import {SessionContext} from "./SessionContext";

//路由匹配前进行认证和权限判断！如果没有登录或权限不够会自动跳转到登录页
export default function PrivateRoute({children, authorities, ...rest}) {
    const {authenticated, hasAnyAuthority, hasAuthority} = useContext(SessionContext);
    // const location = useLocation();
    if (!authenticated) {
        // return <Redirect to={{pathname:'/login', state:{from: location}}} />;
        window.location = '/login.html?from=' + encodeURIComponent(window.location.href);
        return null;
    }
    if (authorities instanceof Array ? hasAnyAuthority(...authorities) : hasAuthority(authorities))
        return <Route {...rest}>{children}</Route>;

    // return <Redirect to={{pathname:'/login', state:{from: location, errMsg: "呔，何方妖孽！不要捣乱！"}}}/>;
    window.location = '/login.html?from=' + encodeURIComponent(window.location.href);
    return null;
}

