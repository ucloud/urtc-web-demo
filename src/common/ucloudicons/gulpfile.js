var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var runSequence = require("run-sequence");
var del = require("del");
var iconfont = require("gulp-iconfont");
var cssnano = require("cssnano");
var versionAppend = require("gulp-version-append");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

var iconfontCssAndTemplate = require("./fontTemplate");

var lib = {
  font_path: "lib/fonts/",
  download_path: "lib/downloads/",
  download_path_tmp: "lib/downloadsTmp/",
  downloadsSVG: "lib/downloads/",
  font_url:
    "http://ued.ucloud.cn/02%E8%A7%86%E8%A7%89/v4%E5%9B%BE%E6%A0%87/%E7%BA%BF%E4%B8%8A%E5%9B%BE%E6%A0%87/",
};

var dist = {
  fonts: "dist/fonts",
  css: "dist/css",
};

const getChannelIds = () => {
  return fs
    .readdirSync(path.resolve(__dirname, lib.download_path_tmp))
    .filter((v) => !/^.+\..+$/.test(v));
};
let channelIds = [0];

gulp.task("syncFontsTmp", function (cb) {
  console.log("同步字体svg开始...");
  exec(
    `rsync -avzP --delete --exclude=".*" icons@192.168.150.90::icons ${path.resolve(
      __dirname,
      lib.download_path_tmp
    )} --password-file=/etc/rsync-client-icons.passwd`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`同步字体svg失败: ${error}`);
        return;
      }
      console.log(stdout);
      channelIds = channelIds.concat(getChannelIds());
      cb();
    }
  );
});

gulp.task("cleanFonts", function () {
  return del([lib.font_path + "**/*", lib.download_path + "**/*"], {
    dot: true,
  });
});

gulp.task("cleanDist", function () {
  return del(["dist/**/*"], { dot: true });
});

// 复制字体到downloads目录
const copyFont2Download = function ({ id, destPath }) {
  const basePath = id
    ? lib.download_path_tmp + id + "/"
    : lib.download_path_tmp;
  const _destPath =
    destPath || (id ? lib.download_path + id + "/" : lib.download_path);

  return new Promise((resolve, reject) => {
    gulp
      .src([basePath + "*.svg"], {
        dot: true,
      })
      .pipe(gulp.dest(_destPath))
      .on("end", () => {
        resolve();
      });
  });
};

gulp.task("copyFont2Download", function (cb) {
  Promise.all(channelIds.map((id) => copyFont2Download({ id }))).then(() => {
    cb();
  });
});

// 复制并合并类型（或渠道）字体
const copyFontAndMerge = function (id) {
  if (id) {
    const basePath = lib.download_path_tmp + id + "/";
    const destPath = lib.download_path + id + "/hybrid/";

    return new Promise((resolve, reject) => {
      copyFont2Download({ id: 0, destPath }).then(() => {
        gulp
          .src([basePath + "*.svg"], {
            dot: true,
          })
          .pipe(gulp.dest(destPath))
          .on("end", () => {
            resolve();
          });
      });
    });
  }
};

gulp.task("copyFontAndMerge", function (cb) {
  console.log("channelIds", channelIds);
  Promise.all(channelIds.map((id) => copyFontAndMerge(id))).then(() => {
    cb();
  });
});

// 字体转换
const svg2Font = function ({
  id,
  fontName = "ucicon",
  cssClass = "icon__",
  cssTargetPath = "icon.css",
  srcPath,
  destPath,
  fontFamilyName,
  templateTargetPath,
}) {
  const _srcPath =
    srcPath ||
    (id ? lib.downloadsSVG + id + "/*.svg" : lib.downloadsSVG + "*.svg");
  const _destPath = destPath || (id ? lib.font_path + id + "/" : lib.font_path);

  return new Promise((resolve, reject) => {
    gulp
      .src([_srcPath])
      .pipe(
        iconfontCssAndTemplate({
          fontFamilyName: fontFamilyName || fontName,
          fontName: fontName,
          cssClass: cssClass,
          cssTargetPath: cssTargetPath,
          ucTypeID: id,
          templateTargetPath,
          ucTypes: channelIds.filter(v => !!v && !/^.+__.+$/.test(v))
        })
      )
      .pipe(
        iconfont({
          fontName: fontName,
          normalize: true,
          formats: ["ttf", "eot", "woff", "svg"],
          fontHeight: 1024,
          descent: 1024 * 0.125, //PingFang SC: 200 / 1000; 微软雅黑: 410 / 2048
        })
      )
      .pipe(gulp.dest(_destPath))
      .on("end", () => {
        console.log(`类型（或渠道）${id} 的字体创建成功！`);
        resolve();
      });
  });
};

// 转换单一目录下字体（不可混用），使用场景如官网www
const transformIconDefault = function (id, destPath) {
  return svg2Font({ id, destPath });
};

// 转换单一目录下字体（可混用，区分font-familt和class前缀），使用场景如所有产品图标
const transformIconDivsion = function (id, destPath) {
  const fontFamilyName = "ucicon-" + id;
  const fontName = "ucicon-division";
  const cssClass = "icon-" + id + "__";
  const cssTargetPath = "icon_division.css";
  const templateTargetPath = "demoTemplate_division.html";

  return svg2Font({
    id,
    fontFamilyName,
    fontName,
    cssClass,
    cssTargetPath,
    templateTargetPath,
    destPath,
  });
};

// 转换目录下字体覆盖合并主目录下字体后的混合字体，使用场景如特定渠道字体109
const transformIconHybrid = function (id, destPath) {
  const fontFamilyName = "ucicon";
  const fontName = "ucicon-hybrid";
  const cssTargetPath = "icon_hybrid.css";
  const srcPath = lib.downloadsSVG + id + "/hybrid/" + "/*.svg";
  const templateTargetPath = "demoTemplate_hybrid.html";

  return svg2Font({
    id,
    fontFamilyName,
    fontName,
    cssTargetPath,
    srcPath,
    templateTargetPath,
    destPath,
  });
};

gulp.task("Iconfont", function (cb) {
  Promise.all(
    channelIds.map((id) => {
      // 大类下某一渠道的字体
      if (/^.+__.+$/.test(id)) {
        const [type, channel] = id.split("__");
        const destPath = lib.font_path + type + "/" + channel + "/"; // 以destPath区分渠道

        return [
          transformIconDefault(type, destPath),
          transformIconDivsion(type, destPath),
          transformIconHybrid(type, destPath),
        ];
      }

      // 普通大类或渠道字体
      if (id) {
        return [
          transformIconDefault(id),
          transformIconDivsion(id),
          transformIconHybrid(id),
        ];
      }

      // 默认渠道全部字体
      return transformIconDefault(id);
    })
  ).then(() => {
    console.log("所有类型（或渠道）字体创建成功！");
    cb();
  });
});

const getCopyBasePath = function (id) {
  if (/^.+__.+$/.test(id)) {
    const [type, channel] = id.split("__");
    return lib.font_path + type + "/" + channel + "/";
  }

  return id ? lib.font_path + id + "/" : lib.font_path;
};

const getCopyDestPath = function (id, destType) {
  if (/^.+__.+$/.test(id)) {
    const [type, channel] = id.split("__");
    return "dist/" + type + "/" + channel + "/" + destType;
  }

  return id ? "dist/" + id + "/" + destType : dist[destType];
};

// 复制字体到dist目录
const copyFont2Dist = function (id) {
  const basePath = getCopyBasePath(id);
  const destPath = getCopyDestPath(id, "fonts");

  return new Promise((resolve, reject) => {
    gulp
      .src(
        [
          basePath + "*",
          "!" + basePath + "icon.css",
          "!" + basePath + "icon_division.css",
          "!" + basePath + "icon_hybrid.css",
        ],
        {
          dot: true,
        }
      )
      .pipe(gulp.dest(destPath))
      .on("end", () => {
        resolve();
      });
  });
};

gulp.task("copyFont2Dist", function (cb) {
  Promise.all(channelIds.map((id) => copyFont2Dist(id))).then(() => {
    cb();
  });
});

// 复制css到dist目录
const copyCSS = function (id) {
  const basePath = getCopyBasePath(id);
  const destPath = getCopyDestPath(id, "css");

  return new Promise((resolve, reject) => {
    return gulp
      .src(
        [
          basePath + "icon.css",
          basePath + "icon_division.css",
          basePath + "icon_hybrid.css",
        ],
        {
          dot: true,
        }
      )
      .pipe(
        versionAppend(["ttf", "eot", "woff", "svg"], {
          appendType: "timestamp",
        })
      )
      .pipe(gulp.dest(destPath))
      .on("end", () => {
        resolve();
      });
  });
};

gulp.task("copyCSS", function (cb) {
  Promise.all(channelIds.map((id) => copyCSS(id))).then(() => {
    cb();
  });
});

// css压缩
const cssMin = function (id) {
  const basePath = getCopyBasePath(id);
  const destPath = getCopyDestPath(id, "css");

  return new Promise((resolve, reject) => {
    gulp
      .src(
        [
          basePath + "icon.css",
          basePath + "icon_division.css",
          basePath + "icon_hybrid.css",
        ],
        {
          dot: true,
        }
      )
      .pipe(
        versionAppend(["ttf", "eot", "woff", "svg"], {
          appendType: "timestamp",
        })
      )
      .pipe($.postcss([cssnano()]))
      .pipe($.rename({ suffix: ".min" }))
      .pipe(gulp.dest(destPath))
      .on("end", () => {
        resolve();
      });
  });
};

gulp.task("cssMin", function (cb) {
  Promise.all(channelIds.map((id) => cssMin(id))).then(() => {
    cb();
  });
});

gulp.task("default", function (cb) {
  runSequence(
    "syncFontsTmp",
    "cleanFonts",
    "copyFont2Download",
    "copyFontAndMerge",
    "Iconfont",
    "cleanDist",
    "copyFont2Dist",
    "copyCSS",
    "cssMin",
    cb
  );
});
