import React, {useState} from 'react';
import {authManager} from "../../api/authManager";
import {useAsyncTask} from "../../hooks";
import './LoginForm.less';

export default function LoginForm() {
    const params = new URLSearchParams(window.location.search);
    const [inputError, setInputError] = useState(params.get("err"));
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const {data, status, execute, error} = useAsyncTask(authManager.login);
    console.info(error);
    if (status === "success") {
        const from = params.get("from") || "/";
        window.location.replace(from);
    }

    const onSubmit = () => {
        if (!username) {
            setInputError("用户名不能为空");
            return;
        }
        if (!password) {
            setInputError("密码不能为空");
            return;
        }

        setInputError(null);
        execute({
            username,
            password,
        });
    };

    return (

        <div className="login-form">
            <div className="login-form-hd">
                欢迎登录商家中心！
            </div>
            <div className="login-err">{inputError}&nbsp;</div>
            <input className="login-input" placeholder="用户名" onChange={ e => setUsername(e.currentTarget.value) } />
            <input className="login-input" placeholder="密码" type="password" onChange={ e => setPassword(e.currentTarget.value) }/>
            <button className="login-submit" onClick={onSubmit}>登录</button>
            <div className="login-err">{status === "error" && error.errMsg}&nbsp;</div>
        </div>

    );
}