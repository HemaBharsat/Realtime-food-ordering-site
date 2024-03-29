// webpack.mix.js

let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css')
   .webpackConfig({
      // ...
      // Look for '--hide-modules' and remove it if found.
   });

mix.babelConfig({
   "plugins": ["@babel/plugin-proposal-class-properties"]
});