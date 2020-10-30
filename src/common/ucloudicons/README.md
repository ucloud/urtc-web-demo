# UCloud字体库

本项目为UCloud产品中的字体图标，同时提供私有Npm包，可以在项目中单独引用。
在[字体平台](https://console-font.pre.ucloudadmin.com/)，可以查看到所有字体预览效果，Class名称和当前版本号等信息。

## 安装

通过npm安装私有字体包。

```
npm install @ucloud/ucloud-icons --registry=http://registry.npm.pre.ucloudadmin.com
```

## 使用

可以通过Webpack打包或直接引用字体包内样式文件。

### Webpack引入字体（推荐）

配置css与字体文件loader

```
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
```

在文件中引入字体样式

```
require('@ucloud/ucloud-icons/dist/css/icon.min.css');
```

关于Webpack的具体使用，详见[官方文档](https://webpack.js.org/)。

### 直接引用

在html文件中引入样式

```
<link rel="stylesheet" href="path/to/node_modules/@ucloud/ucloud-icons/dist/css/icon.min.css">
```

### 使用图标

参考[字体平台](https://console-font.pre.ucloudadmin.com/)中，每个图标下的名称，即为Class名。
如：使用向右箭头图标，可以这样，

```
<span class="icon__arrow-right"></span>
```
同时，可借助`font-size`，`color`等css属性，修改字体图标的表现。

## 新增图标

目前，字体图标的设计与新增由UED同学负责。如果在控制台或官网项目中，有增加字体的需求，可以联系王豪鹏（Aero.Wang）@UED。
