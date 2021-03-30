import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import {SessionContextProvider} from '../../components/SessionContext';
import LoginForm from './LoginForm';
ReactDOM.render(
    <SessionContextProvider>
        <div className="header">
            <div className="login-hd">
                <img src="logo-header.png"/>
            </div>
            <div className="login-bd">
                {/*<div className="login-ad">*/}
                {/*</div>*/}
                <LoginForm/>
            </div>
        </div>
        <div className="footer">
            <div className="copyright">
            Copyright © 2021 ikeyit.xyz出品
            </div>
        </div>
    </SessionContextProvider>,
    document.getElementById('root')
);
