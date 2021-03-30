import React, {useState, useEffect, useRef, useCallback, useContext} from "react";

import {SessionContext} from "../../components/SessionContext";

export default function UserPage() {
    const {session} = useContext(SessionContext);
    const user = session.user;
    if (!user)
        return <div>无法显示储出错了</div>;
    return (
        <div>
            <div>{user.nick}</div>
            <div><img src={user.avatar}/></div>
        </div>
    );
}