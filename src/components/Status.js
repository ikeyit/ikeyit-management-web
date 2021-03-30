import {Alert, Spin} from "antd";
import React from "react";

// export function Status({status, errMsg, children}) {
//     if (status === "error")
//         return <Alert message="出错啦" description={errMsg} type="error" showIcon/>;
//     if (children)
//         return <Spin spinning={status === "loading"} delay={200}>{children}</Spin>;
//     return null;
// }


export function Status({status, errMsg, error, task, children}) {
    status = status || (task && task.status);
    error = error || (task && task.error);
    errMsg = errMsg || (error && error.errMsg);
    return (
        <Spin spinning={status === "loading"} delay={200}>
            {status === "error" && <Alert message="出错啦" description={errMsg} type="error" showIcon/>}
            {children}
        </Spin>
    );
}
