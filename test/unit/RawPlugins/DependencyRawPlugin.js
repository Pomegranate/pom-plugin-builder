/**
 * @file DependencyRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const DRP = require('../../../lib/Validator/Types/DependencyRawPlugin')
const validplugin = {
  moduleName: 'test-dependency-plugin',
  loaded: {
    options: {workDir: '/path'},
    metadata: {name: 'DependencyPlugin', type: 'dependency'},
    plugin: {
      load: function() {},
      start: function() {},
      stop: function() {}
    }
  }
}

tap.test('Instantiate Dependency plugins', (t) =>{
  t.throws(function() {
    new DRP()
  }, 'Throws with no args')

  let op = new DRP(validplugin);
  t.ok(op instanceof DRP, 'Constructs properly')
  t.end()
})