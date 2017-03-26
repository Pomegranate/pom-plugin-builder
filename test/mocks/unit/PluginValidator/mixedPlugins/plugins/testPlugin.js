/**
 * @file testPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-loader
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var util = require('util');
/**
 *
 * @module testPlugin
 */
exports.options = {
  workDir: 'testPlugin_workdir'
}

exports.metadata = {
  name: 'Test-plugin',
  type: 'service',
  param: 'Test'
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {name: 'Test'});
  },
  start: function(done) {
    done()
  },
  stop: function(done) {
    done()
  }
}

exports.errors = {
  TestError: TestError
};


function TestError(){
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = "HookTimeoutError";
  this.message = thisErr.message;
  if(Error.captureStackTrace){
    Error.captureStackTrace(this, this.constructor)
  }
}

util.inherits(TestError, Error);