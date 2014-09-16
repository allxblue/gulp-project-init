/*--------------------------------------------------------------------------
  Load: 預設載入初始化
--------------------------------------------------------------------------*/

/**
 * gulp: 載入
 */
var gulp = require('gulp');


/**
 * plugins: 使用的plugin列表
 */
var plugins = {
    browserSync   : require('browser-sync')       // 自動重整
  , fs            : require('fs')                 // file system
  , tap           : require('gulp-tap')           // 流過處理
  , gutil         : require('gulp-util')          // gulp util
  , concat        : require('gulp-concat')        // 合併文件
  , gulpif        : require('gulp-if')            // 三元判斷
  , uglify        : require('gulp-uglify')        // 壓縮js
  , sass          : require('gulp-sass')          // sass
  , compass       : require('gulp-compass')       // sass用
  , minifyCSS     : require('gulp-minify-css')    // css壓縮
  , imagemin      : require('gulp-imagemin')      // 圖檔壓縮
  , autoprefixer  : require('gulp-autoprefixer')  // 自動修正css
  , livereload    : require('gulp-livereload')    // 存檔後自動refresh
  , plumber       : require('gulp-plumber')       // 報錯後繼續執行Stream
  , watch         : require('gulp-watch')         // 偵聽檔案變化
  , notify        : require('gulp-notify')        // 提示訊息用
  , rename        : require('gulp-rename')        // 改名
  , cssDoc        : require('gulp-styledocco')    // CSS註解文件
  , handlebars    : require('gulp-compile-handlebars')    // handlebars 編譯
  , path          : require('path')
}

/*--------------------------------------------------------------------------
  Project: 專案相關設定
--------------------------------------------------------------------------*/

/**
 * project: 專案設定
 */
var app = {
    title: '專案名稱'
  , name: 'porj'
  , baseUrl: '/'
  , useBootstrap: true
  , useModernizr: true
  , useFontawesome: true

};


/**
 * path: 路徑設定
 */
var paths = {

  styles: {
        src:    './public/css'
      , files:  './public/css/*.css'
      , dest:   './build/public/css'
  },

  sass: {
        src:    './public/sass'
      , files:  './public/sass/main.scss'
      , dest:   './build/public/sass'
  },

  scripts:{
        src:    './public/js'
      , files:  './public/js/*'
      , dest:   './build/public/js'
  },

  images:{
        src:    './public/images'
      , files:  './public/images/**/*'
      , dest:   './build/public/images'
  },

  hbs:{
        src:    './views'
      , files:  './views/**/*.hbs'
      , dest:   './build/'
  }

};


/**
 * scriptList: 載入js檔及排序
 */
var scriptList = [
    'jquery.min.js'
  , 'jquery.unveil.min.js'
  , 'main.js'
].map(function(val){ return paths.scripts.src + "/" + val; });


/**
 * scriptList: 載入css檔及排序
 */
var cssList = [
    'main.css'
  , 'main-m.css'
  , 'main-s.css'
].map(function(val){ return paths.styles.src + "/" + val; });


/*--------------------------------------------------------------------------
  Task 
--------------------------------------------------------------------------*/

/**
 * scripts: 壓縮及合併js
 * cmd : gulp scripts
 * flow : 載入js群 -> 壓縮 -> 合併 -> 輸出
 */
gulp.task('scripts', function() {
  return gulp.src(scriptList)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('combined.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
});

/**
 * css: 壓縮及合併css
 * cmd : gulp css
 * flow : 載入css群 -> 壓縮 -> 合併 -> 輸出
 */
gulp.task('css', function() {
  return gulp.src(cssList)
    .pipe(plugins.minifyCSS())
    .pipe(plugins.concat('combined.min.css'))
    .pipe(gulp.dest(paths.styles.dest));
});

/**
 * images: 壓縮圖檔
 * cmd : gulp images
 * flow : 載入圖（帶入位置） -> 調整壓縮等級 -> 輸出
 */
gulp.task('images', function() {
return gulp.src(paths.images.files)
    // 重新壓縮圖片
    .pipe(pluginsimagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest));
});


/**
 * sass-dev: css預處理
 * cmd : gulp sass-dev
 * flow : 載入css -> 載入plumber -> sass(css編譯) -> autoprefixer -> 呼叫處理css壓縮
 */
gulp.task('sass-dev', function() {
return gulp.src(paths.sass.files)
    .pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.notify("Found file: <%= file.relative %>!"))
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(paths.sass.dest))
    
});

/**
 * hbs: handlebars處理
 * 在windows上沒有處理batch的function，可能要去該index.js將github上的function補上
 * batch即是掃描該資料夾底下，並尋找是否有要註冊hbs的template
 * 在template要使用 {{> views/partials/header }} 去載入，也就是包含views路徑
 */
gulp.task('hbs', function(){
  var appInfo = app
    , options = {
          partials : {
              footer : '<footer>footer content</footer>'
          },
          batch : ['./views'],
          helpers : {
              capitals : function(str){
                  return str.toUpperCase();    
              }
          }
      }
return gulp.src(paths.hbs.src + "/pages/**/*.hbs")
    .pipe(plugins.plumber())
    .pipe(plugins.handlebars(appInfo, options))
    .pipe(plugins.tap(function(file, t) {
        file.path = plugins.gutil.replaceExtension(file.path, '.html');
    }))
    .pipe(gulp.dest(paths.hbs.dest));
});


/**
 * browser-sync: static server 
 *
 */
gulp.task('browser-sync', function() {
  plugins.browserSync({
              server: {
                  baseDir: "./build/",
                  proxy: app.name + ".dev"
              }
          });
});

/**
 * copyfile
 */
gulp.task('copyfile', function(){
  return gulp.src("./public/**/*.*")
        .pipe(gulp.dest('build/public'));
});



/**
* combo: 
*/
gulp.task('init', ['hbs', 'sass-dev', 'copyfile']);
gulp.task('dev', ['hbs', 'sass-dev', 'browser-sync']);

/**
 * default 
 * cmd : gulp
 * flow : 編譯css -> 偵聽路徑檔案變化
 */
gulp.task('default', function () {
    gulp.run('dev');
    gulp.watch(paths.sass.src + "/**/*.scss", ['sass-dev',  plugins.browserSync.reload]);   
    gulp.watch(paths.hbs.files, ['hbs',  plugins.browserSync.reload]);
});

