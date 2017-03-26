/**
 * @file OverrideRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const IRP = require('../../../lib/Validator/Types/InstallerRawPlugin')
const validplugin = {
  moduleName: 'test-installer-plugin',
  loaded: {
    metadata: {name: 'InstallerPlugin', type: 'installer'},
    installer: function(){}
  }
}

tap.test('Instantiate Installer plugins', (t) =>{
  t.throws(function() {
    new IRP()
  }, 'Throws with no args')

  let op = new IRP(validplugin);
  t.ok(op instanceof IRP, 'Constructs properly')
  t.end()
})

tap.test('Sets installer property.', (t) => {
  let op = new IRP(validplugin)

  t.type(op.installer, 'function', 'Sets installer property')
  t.ok(op.isInstaller(), 'isOverride() returns true.')
  t.notOk(op.hasErrors(), 'No errors')

  t.end()
})

tap.test('Sets installer to false when missing', (t) => {
  let missing = {
    moduleName: 'test-installer-plugin',
    loaded: {
      options: {workDir: '/path'},
      metadata: {name: 'InstallerPlugin', type: 'installer'}
    }
  }

  let op = new IRP(missing)

  t.notOk(op.installer, 'Is false ')
  t.ok(op.hasErrors(), 'Has Errors with no installer set.');

  t.end()

})