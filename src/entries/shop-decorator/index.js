import React from 'react';
import ReactDOM from 'react-dom';
import {SessionContextProvider} from "../../components/SessionContext";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import PageEdit from "./PageEdit";
import "./index.less";

ReactDOM.render(
    <SessionContextProvider>
        {/*<ConfigProvider>*/}
        {/*<React.StrictMode>*/}
        <DndProvider backend={HTML5Backend}>
        <Router>
            <PrivateRoute path="/" authorities="ROLE_SELLER">
                <Switch>
                    <Route path="/edit/:pageId">
                        <PageEdit/>
                    </Route>
                </Switch>
            </PrivateRoute>
        </Router>
        </DndProvider>
        {/*</React.StrictMode>*/}
        {/*</ConfigProvider>*/}
    </SessionContextProvider>,
    document.getElementById('root')
);
