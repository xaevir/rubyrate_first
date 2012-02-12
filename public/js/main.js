// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    text: 'libs/require/text',
    order: 'libs/require/order',
    templates: '../templates'
  }

});


/*
 *  calling them in order bc not amd.
 *  in order to call App, the fn has to be passed
 *  placeholder args
 */ 
require([
  'order!jquery',          
  'order!libs/utilities',   
  'order!underscore',       
  'order!backbone',         
  'libs/jade/jade',        
  'bootstrap/js/bootstrap-dropdown.js',
  'order!app'             
], function(a, b, c, d, e, f, App){
  App.initialize();
});
