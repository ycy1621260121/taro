# 前言

**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

使用 **Taro**，我们可以只书写一套代码，再通过 **Taro** 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动小程序、H5、React-Native 等）运行的代码。

该项目基于Taro，构建了一个时装衣橱的项目演示，涉及了一个电商平台完整的业务逻辑和功能点，如果这个项目能驾驭的了，相信大部分公司的其他React项目也就不在话下。


# 技术栈

React + Taro + Dva + Sass + ES6/ES7

## 项目运行

```

https://github.com/ycy1621260121/taro

cd taro

# 全局安装taro脚手架
npm install -g @tarojs/cli@1.2.2

# 项目依赖为1.2.2版本，如要升级，请同时升级项目依赖
# 如用1.2.2版本，请忽略这句
taro update project

# 安装项目依赖
npm install

#如果安装出现vs2005错误,删除node_modules,运行下面的代码后再npm install：
npm install --global --production windows-build-tools

# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# 百度小程序
npm run dev:swan

# 字节跳动小程序
npm run dev:tt

# H5
npm run dev:h5

# React Native
npm run dev:rn

# pages模版快速生成
npm run tep `文件名`

```


## 适配进度

- [x] H5 -- 完美适配
- [x] 微信小程序 -- 完美适配
- [x] 支付宝小程序 -- 95%适配
- [x] 百度小程序 -- 95%适配
- [ ] 字节跳动小程序 -- 适配中
- [ ] React Native -- 适配中
- [ ] 快应用 -- 适配中

# 文档

### Taro开发文档

> https://nervjs.github.io/taro/docs/README.html

### dva开发文档地址

> https://dvajs.com/

### 微信小程序官方文档

> https://mp.weixin.qq.com/debug/wxadoc/dev/

### 百度智能小程序官方文档

> https://smartprogram.baidu.com/docs/introduction/register/index.html

### 支付宝小程序官方文档

> https://docs.alipay.com/mini/developer/getting-started

### 字节跳动小程序官方文档

> https://microapp.bytedance.com/
