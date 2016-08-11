/* eslint-env node */

module.exports = function( config ) {
   config.set( karmaConfig() );
};

const karma = require( 'karma' );
const path = require( 'path' );

const resolve = p => path.resolve( __dirname, p );
const polyfillsPath = resolve( 'includes/lib/laxar/dist/polyfills.js' );
const specPattern = resolve( './includes/widgets/shop-demo/**/spec/*.spec.js' );
const assetsPattern = resolve( './includes/widgets/shop-demo/**/*.*' );

if( require.main === module ) {
   const configs = require( 'glob' ).sync( specPattern ).map( karmaConfigForWidget );
   run( configs );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function karmaConfig() {

   const browsers = [ 'PhantomJS', 'Firefox' ].concat( [
      process.env.TRAVIS ? 'ChromeTravisCi' : 'Chrome'
   ] );

   return {
      frameworks: [ 'jasmine' ],
      files: [
         polyfillsPath,
         specPattern,
         { pattern: assetsPattern, included: false }
      ],
      preprocessors: {
         [ specPattern ]: [ 'webpack', 'sourcemap' ]
      },
      proxies: {
         '/includes': '/base/includes'
      },
      webpack: webpackConfig(),
      webpackMiddleware: {
         noInfo: true
      },

      reporters: [ 'progress' ],
      port: 9876,
      browsers,
      customLaunchers: {
         ChromeTravisCi: {
            base: 'Chrome',
            flags: [ '--no-sandbox' ]
         }
      },
      browserNoActivityTimeout: 100000,
      singleRun: true,
      autoWatch: false
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function karmaConfigForWidget( specPath ) {
   return Object.assign( karmaConfig(), {
      name: path.basename( specPath ),
      files: [
         polyfillsPath,
         specPath,
         { pattern: assetsPattern, included: false }
      ]
   } );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function webpackConfig() {
   const config = Object.assign( {}, require('./webpack.config' ) );
   delete config.entry.app;
   delete config.entry.vendor;
   config.plugins = config.basePlugins;
   config.devtool = 'inline-source-map';
   return config;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function run( configs, lastExitCode ) {
   if( !configs.length || lastExitCode ) {
      process.exit( lastExitCode );
   }
   const config = configs.shift();
   const specFile = config.files[ 1 ];
   process.stdout.write( `Karma: launching ${specFile}\n` );
   const server = new karma.Server( config, exitCode => {
      process.stdout.write( `Karma: exited with ${exitCode}\n` );
      run( configs, exitCode );
   } );
   server.start();
}
