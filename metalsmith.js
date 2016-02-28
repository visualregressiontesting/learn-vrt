var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var assets = require('metalsmith-assets');
var sass = require('metalsmith-sass');
var nunjucks = require('nunjucks');
var autoprefixer = require('metalsmith-autoprefixer');

var metalsmith = Metalsmith(__dirname);

nunjucks
  .configure('templates', {watch: false, noCache: true});

var metadata = {};

if (process.env.SERVE) {
  metadata.serve = true;
  metalsmith
    .use(serve({
        port: 8080
    }))
    .use(watch({
        paths: {
          "${source}/**/*": true,
          "templates/**/*": "**/*",
          "sass/**/*": "**/*",
        },
        livereload: true
    }));
}

metalsmith
  .metadata(metadata)
  .clean(false)
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './' // relative to the build directory
  }))
  .use(sass({
    outputDir: 'css/'   // This changes the output dir to "build/css/" instead of "build/scss/"
  }))
  .use(autoprefixer())
  .use(layouts({
    engine: 'nunjucks',
    directory: 'templates'
  }))
  .build(function(err){
    if (err) throw err;
  });
