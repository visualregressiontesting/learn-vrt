var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var assets = require('metalsmith-assets');
var nunjucks = require('nunjucks');
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
  .use(layouts({
    engine: 'nunjucks',
    directory: 'templates'
  }))
  .build(function(err){
    if (err) throw err;
  });
