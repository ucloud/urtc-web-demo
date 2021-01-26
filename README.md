<!--
 * @Author: your name
 * @Date: 2021-01-25 16:10:28
 * @LastEditTime: 2021-01-25 17:16:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /urtc-web-demo/README.md
-->

本 demo 运行网址：https://web.urtc.com.cn/

初始化项目
#安装

```
npm install 或 yarn
```

#启动
```
yarn start
```

#打包
```
yarn build
```

#配置文件

> 注：
>
> 1. AppId 和 AppKey 可从 URTC 产品中获取，可以参考 https://docs.ucloud.cn/urtc/quick 。
> 2. AppKey 不可暴露于公网，建议生产环境时，由后端进行保存并由前端调 API 获取
> 3. 由于浏览器的安全策略对除 127.0.0.1 以外的 HTTP 地址作了限制，Web SDK 仅支持 HTTPS 协议 或者 http://localhost（http://127.0.0.1）, 请勿使用 HTTP 协议 部署你的项目。
