/**
 * @file CommonRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const CRP = require('../../../lib/Validator/Types/CommonRawPlugin')
const util = require('util')
const validplugin = {
  moduleName: 'test-raw-plugin',
  loaded: {
    options: {workDir: '/path'},
    metadata: {name: 'RawPlugin', type: 'service'},
    plugin: {
      load: function() {},
      start: function() {},
      stop: function() {}
    },
    errors: {
      TestPluginError: TestPluginError
    }
  }
}

function TestPluginError(){

}
util.inherits(TestPluginError, Error)

tap.test('Instantiate raw plugins', (t) =>{
  t.throws(function() {
    new CRP()
  }, 'Throws with no args')

  let rp = new CRP(validplugin);
  t.ok(rp instanceof CRP, 'Constructs properly')
  t.end()
})

tap.test('Validates presence of module name', (t) => {
  let invalid = new CRP({});
  let valid = new CRP(validplugin)
  t.ok(invalid.hasErrors(), 'Invalid plugin has errors.')
  t.notOk(invalid.isValid(), 'Invalid plugin is not valid.')

  t.notOk(valid.hasErrors(), 'Valid plugin has no errors.')
  t.ok(valid.isValid(), 'Valid plugin is valid.')
  t.notOk(valid.isOverride(), 'Not an override plugin.')
  t.notOk(valid.isInstaller(), 'Not an installer plugin.')

  t.end()
})

tap.test('Validate Options', (t) => {
  let failRp = new CRP({moduleName: 'test-raw-plugin'})
  let passRp = new CRP(validplugin)
  t.notOk(failRp.validOptions(), 'validOptions() is false with no args.')
  t.notOk(failRp.validOptions('String'), 'validOptions() is false with string arg.')
  t.notOk(failRp.validOptions([]), 'validOptions() is false with array arg.')
  t.notOk(failRp.validOptions({}), 'validOptions() is false with empty object arg.')

  t.ok(passRp.validOptions({workDir: '/path'}), 'validOptions() is ok with populated object arg.')
  t.ok(passRp.getDefaultOptions(), 'Returns options if set.')
  t.end()
})

tap.test('Validate Metadata', (t) => {
  let passRp = new CRP(validplugin)
  let failRp = new CRP({moduleName: 'test-raw-plugin'})
  let failTypeRp = new CRP({moduleName: 'test-raw-plugin'})
  let failNameRp = new CRP({moduleName: 'test-raw-plugin'})

  let pass = passRp.validMetadata({
    name: 'RawPlugin',
    type: 'service'
  })

  let failMissing = failRp.validMetadata()

  let failType = failTypeRp.validMetadata({
    name: 'RawPlugin',
    type: 'herpderp'
  })
  let failTypeMissing = failTypeRp.validMetadata({
    name: 'RawPlugin'
  })

  let failName = failNameRp.validMetadata({
    type: 'herpderp'
  })

  t.ok(pass, 'validMetadata() is true with proper args.')
  t.notOk(passRp.hasErrors(), 'Has no Errors with correct args.')
  t.equals(passRp.getType(), 'service', 'getType() returns correct type.')
  t.ok(passRp.isValid(), 'Valid with correct arg.')

  t.notOk(failMissing, 'validMetadata() is false with no arg.')
  t.ok(failRp.hasErrors(), 'validMetadata() pushes an error onto Errors[] in when failing.')
  t.notOk(failRp.isValid(), 'Not valid with no arg.')

  t.notOk(failRp.validOptions('String'), 'validMetadata() is false with string arg.')
  t.notOk(failRp.validOptions([]), 'validMetadata() is false with array arg.')
  t.notOk(failRp.validOptions({}), 'validMetadata() is false with empty object arg.')


  t.notOk(failTypeMissing, 'validMetadata() is false with a missing type.')
  t.notOk(failType, 'validMetadata() is false with an improper type.')
  t.ok(failTypeRp, 'Has errors with incorrect type.')
  t.notOk(failTypeRp.isValid(), 'Not valid with incorrect type.')

  t.notOk(failName, 'validMetadata() is false with missing name.')
  t.notOk(failNameRp.isValid(), 'Not valid with missing name.')
  t.ok(failNameRp, 'Has errors with missing name.')
  t.type(failNameRp.getErrors(), 'object', 'Returns ab object containing encountered errors.')
  t.end()
})

tap.test('Validate hooks', (t) => {
  let passRp = new CRP(validplugin)
  let failRp = new CRP({moduleName: 'test-raw-plugin'})
  let failTypeRp = new CRP(validplugin)

  let pass = passRp.validHooks({
    load: function(){},
    start: function(){},
    stop: function(){}
  })
  let failMissing = failRp.validHooks()
  let failType = failTypeRp.validHooks({
    load: 'load',
    start: 'start',
    stop: 'stop'
  })

  t.ok(pass, 'validHooks() is true with proper args')
  t.ok(passRp.getHooks(), 'Returns hooks if set.')

  t.notOk(failMissing, 'validHooks() is false with missing args.')
  t.ok(failRp.hasErrors(), 'validHooks() pushes an error onto Errors[] in when failing.')
  t.notOk(failRp.isValid(), 'Not valid with missing args.')

  t.notOk(failType, 'validHooks() is false with wrong args.')
  t.ok(failTypeRp.hasErrors(), 'validHooks() pushes an error onto Errors[] in when failing.')
  t.notOk(failTypeRp.isValid(), 'Not valid with wrong args.')

  t.end()
})

tap.test('Validate Errors', (t) => {
  let passRp = new CRP(validplugin)
  let failRp = new CRP({moduleName: 'test-raw-plugin'})

  let fail = failRp.validErrors("string")


  t.ok(passRp.getCustomErrors(), 'Custom errors are set.')
  t.notOk(fail, 'validErrors() returns false with bad arguments.')
  t.notOk(failRp.getCustomErrors(), 'Custom errors are not set.')

  t.end()
})