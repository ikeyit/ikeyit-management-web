import React from 'react'
import "./App.less";



export default function App() {
    return (
        <>
            <div className="site-header">
                <div className="site-title">
                   <img src="logo-header.png"/>
                    <div className="site-slogan">
                        IKEYIT 0.1.0，一个开源的电商平台系统，支持多店铺。
                    </div>
                    <div className="site-github">
                        <a href="https://github.com/ikeyit/ikeyit-services" target="_blank">
                            <img src="https://img.shields.io/github/stars/ikeyit/ikeyit-services.svg?style=social&label=Stars"/>
                            <img src="https://img.shields.io/github/forks/ikeyit/ikeyit-services.svg?style=social&label=Fork"/>
                        </a>
                    </div>
                    <div className="demo">
                        <div className="demo-title">演示系统</div>
                        <a href="seller-center.html" className="demo-entry ripple">卖家管理中心</a>
                        <a href="super-center.html" className="demo-entry ripple">平台管理中心</a>
                        <div className="demo-tip">加微信：wodead，索要测试账号</div>
                    </div>

                </div>
            </div>
            <div className="site-body">
                <div className="feature">
                    <h3>IKEYIT的起源？</h3>
                    <p>
                        这个说来话长，IKEYIT前身为布谷商城和社区。经过微服务化改造后开源给大家。
                    </p>
                </div>
                <div className="feature">
                    <h3>IKEYIT主要由哪些技术开发？</h3>
                    <p>
                        系统采用前后端分离微服务构架，后端主要由Java, Spring Boot, Mybatis, Spring Cloud Alibaba开发。搜索：Elasticsearch，
                        消息队列：Rocket MQ，服务注册中心/配置中心：Nacos，数据库：Mysql，Redis<br/>
                        买家前端目前仅支持小程序，Android/IOS即将推出。管理后台为基于React + Ant Design的SPA。<br/>
                        安全方面使用Spring Security + JWT实现。
                    </p>
                </div>
                <div className="feature">
                    <h3>IKEYIT能给你带来什么好处？</h3>
                    <p>
                        1.中小企业可以直接用来架设自己的私有网店系统。<br/>
                        2.学习SpringBoot开发微服务的参考。IKEYIT代码上尽量减少依赖，避免学习成本过高。<br/>
                        3.项目结构尽可能清晰，方便在此基础上做调优，适配第三方。<br/>
                    </p>
                </div>
                <div className="feature">
                    <h3>如何支持IKEYIT？</h3>
                    <p>
                        方式一，关注IKEYIT github<br/>
                        方式二，加微信号wodead，畅谈人生，钻研技术或金钱支持。<br/>
                    </p>
                </div>
            </div>
        </>
    );
}


