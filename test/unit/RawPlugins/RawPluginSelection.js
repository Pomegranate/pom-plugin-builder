/**
 * @file RawPluginSelection
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const RawPlugin = require('../../../lib/Validator')

const dependencyPlugin = {
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

const installerplugin = {
  moduleName: 'test-installer-plugin',
  loaded: {
    metadata: {name: 'InstallerPlugin', type: 'installer'},
    installer: function(){}
  }
}

const overrideplugin = {
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

tap.test('Creating dependency plugin', (t) => {
  let p = RawPlugin(dependencyPlugin)
  t.end()
})

tap.test('Creating installer plugin', (t) => {
  let p = RawPlugin(installerplugin)
  t.end()
})

tap.test('Creating override plugin', (t) => {
  let p = RawPlugin(overrideplugin)
  t.end()
})