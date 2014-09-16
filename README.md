gulp-project-init
=================
use gulp with handlebars generate static page


## project init
```cms
$ git clone https://github.com/allxblue/gulp-project-init && cd gulp-project-init && npm start
```

##Dependencies
 * gulp
 * bower

##Gulp task

 * `gulp init` compile handlebar template and sass then copy public directory to build 
 * `gulp` (defualt) watch file changed and call browser-sync (static server)


##Web config
```js
var app = {
    title: 'site name'
  , name: 'porj'
  , baseUrl: '/'
  , useBootstrap: true
  , useModernizr: true
  , useFontawesome: true
};

```

