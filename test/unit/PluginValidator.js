/**
 * @file PluginValidator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const tap = require('tap')
const mocks = require('pom-test-stubs')
const PluginFinder = require('../../lib/PluginFinder')
const PluginValidator = require('../../lib/PluginValidator')

tap.test('Validating plugins', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/pluginValidator/mixedPlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)

  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)
  let RawPlugins = PluginValidator(FoundPlugins, frameworkInjector)

  t.type(RawPlugins, 'Array', 'Plugin validator is an array.')

  t.equal(RawPlugins.length, 4, 'Found 2 plugins.')

  RawPlugins.forEach((v, k) => {
    t.type(v, 'DependencyRawPlugin',`${v.moduleName} is DependencyRawPlugin`)
  })

  t.end()
})

tap.test('Validating nested multiple plugins', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/pluginValidator/multiplePlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)

  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)
  let RawPlugins = PluginValidator(FoundPlugins, frameworkInjector)

  t.type(RawPlugins, 'Array', 'Plugin validator is an array.')
  t.equal(RawPlugins.length, 7, 'Found 2 plugins.')

  RawPlugins.forEach((v, k) => {
    t.type(v, 'DependencyRawPlugin',`${v.moduleName} is DependencyRawPlugin`)
  })

  t.end()
})

tap.test('Handling non existent plugins.', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/pluginValidator/mixedPlugins')
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)

  let FakeModules = [{
    require: __dirname + '/thishopefullydoesntexist.js',
    external: false,
    internal: false,
    systemPlugin: true,
    moduleName: 'FakeModule',
    loaded:
      { options: { checkExistence: [] },
        metadata: { name: 'Fake', type: 'action' },
        plugin:
          {
            load: function(){},
            start: function(){},
            stop: function(){}
          }
      }
  }]

  t.throws(function() {
    PluginValidator(FakeModules, frameworkInjector)
  }, 'Throws an error after exhausing all attempts to load a module.')

  t.end()
})

