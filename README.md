<!--
 * @Author: cven.li
 * @Date: 2021-01-25 16:10:28
 * @LastEditTime: 2021-01-25 17:16:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /urtc-web-demo/README.md
-->

## 1 描述
urtc-web是UCloud推出的一款适用于全终端观看的实时音视频Demo，给用户提供案例源码，帮忙用户快速接入webrtc音视频业务。用户可通过电脑/手机H5/平板/微信/智能电视等平台，随时随地观看直播。支持高度定制以及二次开发。



## 2 功能列表

* 摄像头、扬声器、麦克风检测功能

* 自定义用户名、自定义视频格式

* 基本的音视频通话功能

* 关闭本地/远端视频、本地/远端音频功能

* 摄像头切换功能

* 视频尺寸的配置(180P - 1080P)

* 自动重连

* 纯音频互动

* 视频的大小窗口切换

* 获取视频房间统计信息（帧率、码率、丢包率等）

* 屏幕录制功能

* 自动订阅 自动手动发布

* 权限（上行/下行/全部）控制

* 分享功能

* 视频录制/视频存储

* 旁路直播/视频转推

* 私有化部署


## 3 项目架构

![avatar](https://static.ucloud.cn/docs/urtc/images/introduction/structure.png?v=1611734686)

## 4 项目优势

### 4.1 全球实时传输
依托于UCloud强大的覆盖能力，全球就近接入，跨国跨运营商传输，提供覆盖全球的音视频通信服务。

### 4.2 低延时
依赖UCLOUD的全球基础设施，保证国际链路端到端平均时延 <300ms，优于行业同系列产品。

### 4.3 抗弱网
通过全球就近接入点接入、基于HTTPDNS自研调度算法、丢包重传，实现弱网高质量通信，70%丢包仍可正常通信。

### 4.4 多通话模式
支持语音通话，支持一对一、多方视频通话，支持一对多连麦。


## 5 初始化项目
### 安装

```
npm install 或 yarn
```

### 启动
```
npm run start 或 yarn start
```

### 打包
```
npm run build 或 yarn build
```

### 配置文件

> 注：
>
> 1. AppId 和 AppKey 可从 URTC 产品中获取，可以参考 https://docs.ucloud.cn/urtc/quick 。
> 2. AppKey 不可暴露于公网，建议生产环境时，由后端进行保存并由前端调 API 获取
> 3. 由于浏览器的安全策略对除 127.0.0.1 以外的 HTTP 地址作了限制，Web SDK 仅支持 HTTPS 协议 或者 http://localhost（http://127.0.0.1）, 请勿使用 HTTP 协议 部署你的项目。

