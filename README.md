#  IKEYIT 后台管理系统
基于React多SPA项目，工程分为多个入口。代码全面拥抱hooks，和函数式组件。几乎没有用任何类组件！代码更加简洁。
后端微服务工程：https://github.com/ikeyit/ikeyit-services

## 技术栈
Javascript  
React
React-Router  
React Hooks   
Ant Design  
Webpack  

## 跑起来

- 拉取项目代码
```bash
git https://github.com/ikeyit/ikeyit-management-web.git
cd ikeyit/ikeyit-management-web
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn start
```

- 编译项目
```
yarn build
```

## 其它说明
由于create-react-app对webpack进行了封装，没有webpack.config.js可以进行配置。要进行定制有两种方式：  
1. 执行eject命令，将封装的js释放到工程量。此操作不可逆，这样就失去了以后react-scripts升级带来的好处。
`yarn eject`
2. 使用craco，进行覆盖。项目采用这个方案。 配置需要在craco.config.js进行。 