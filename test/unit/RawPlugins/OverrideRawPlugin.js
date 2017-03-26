/**
 * @file OverrideRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const ORP = require('../../../lib/Validator/Types/OverrideRawPlugin')
const validplugin = {
  moduleName: 'test-override-plugin',
  loaded: {
    options: {workDir: '/path'},
    metadata: {name: 'OverridePlugin', type: 'override'},
    plugin: {
      load: function() {},
      start: function() {},
      stop: function() {}
    },
    override: {
      module: 'test-raw-plugin',
      name: 'OverrideTest'
    }
  }
}

tap.test('Instantiate Override plugins', (t) =>{
  t.throws(function() {
    new ORP()
  }, 'Throws with no args')

  let op = new ORP(validplugin);
  t.ok(op instanceof ORP, 'Constructs properly')
  t.end()
})

tap.test('Sets override property.', (t) => {
  let op = new ORP(validplugin)

  t.type(op.override, 'object', 'Sets override property')
  t.ok(op.isOverride(), 'isOverride() returns true.')
  t.notOk(op.hasErrors(), 'No errors')

  t.end()
})

tap.test('Sets override to false when missing', (t) => {
  let missing = {
    moduleName: 'test-override-plugin',
    loaded: {
      options: {workDir: '/path'},
      metadata: {name: 'OverridePlugin', type: 'override'},
      plugin: {
        load: function() {},
        start: function() {},
        stop: function() {}
      }
    }
  }

  let op = new ORP(missing)

  t.notOk(op.override, 'Is false ')
  t.ok(op.hasErrors(), 'Has Errors with no override set.');

  t.end()

})