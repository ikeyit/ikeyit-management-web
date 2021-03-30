import {Link, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import React, {useMemo} from "react";
import {matchPath} from "react-router";
import {Breadcrumb, Layout, Menu} from "antd";
const { SubMenu } = Menu;
const { Header, Content, Sider} = Layout;

export default function BasicLayout({menus, routes, header, openMenus}) {
    const {path} = useRouteMatch();
    const location = useLocation();
    const defaultSelectedKeys = useMemo(() => {
        const currentRoute = routes.find(route => matchPath(location.pathname,
            {
                path: path + route.path,
                exact: route.exact
            }
        ));
        return currentRoute && currentRoute.menu && [currentRoute.menu];
    }, []);

    return (
        <Layout>
            <Header className="header">
                {header}
            </Header>
            <Layout>
                <Sider className="site-layout-sider">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={openMenus}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {
                            menus.map((menu, index)=>
                            menu.items ?
                                <SubMenu key={index} icon={menu.icon} title={menu.title}>
                                    {menu.items.map(item =>
                                        <Menu.Item key={item.key}>
                                            <Link to={path + item.link}>{item.title}</Link>
                                        </Menu.Item>
                                    )}
                                </SubMenu>
                                :
                                <Menu.Item key={menu.key}  icon={menu.icon}>
                                    <Link to={path + menu.link}>{menu.title}</Link>
                                </Menu.Item>
                            )
                        }

                    </Menu>
                </Sider>
                <Layout>
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={path + route.path}
                                exact={route.exact}
                            >
                                {route.breadcrumb &&
                                <Breadcrumb className="site-breadcrumb">
                                    {route.breadcrumb.map((item, ind) =>
                                        <Breadcrumb.Item key={ind}>{item}</Breadcrumb.Item>
                                    )}
                                </Breadcrumb>
                                }
                                <Content className="site-layout-content">
                                    {route.component}
                                </Content>
                            </Route>
                        ))}
                    </Switch>
                </Layout>
            </Layout>
        </Layout>
    );
}