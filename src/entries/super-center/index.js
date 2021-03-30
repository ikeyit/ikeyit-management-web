import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import reportWebVitals from '../../utils/reportWebVitals';
import {SessionContextProvider} from '../../components/SessionContext';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale/zh_CN";

ReactDOM.render(
    <SessionContextProvider>
        {/*<ConfigProvider>*/}
        {/*<React.StrictMode>*/}
        <DndProvider backend={HTML5Backend}>
            <ConfigProvider locale={zhCN}>
            <App />
            </ConfigProvider>
        </DndProvider>
        {/*</React.StrictMode>*/}
        {/*</ConfigProvider>*/}
    </SessionContextProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
