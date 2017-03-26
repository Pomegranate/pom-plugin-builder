/**
 * @file ApplicationEnvironment
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

const tap = require('tap')
const ApplicationEnv = require('../../../lib/FrameworkPlugins/ApplicationEnvironment')
const Harness = require('pom-test-harness').tapHarness

Harness(tap, ApplicationEnv)

tap.test('Load Hook', (t) => {
  t.doesNotThrow(function() {
    ApplicationEnv.plugin.load.bind({options: {checkExistence:[]}})(null, ()=>{})
  }, 'Load Hook does not throw.')

  t.doesNotThrow(function() {
    process.env.hookEnv = 'ok'
    ApplicationEnv.plugin.load.bind({options: {checkExistence:['hookEnv']}})(null, (err)=>{
      t.notOk(err, 'No error returned to callback.')
      t.type(err, 'null', 'Has type - null.')
    })
  }, 'Testing for env vars soes not throw.')

  t.doesNotThrow(function() {
    ApplicationEnv.plugin.load.bind({options: {checkExistence:['fakeEnv']}})(null, (err)=>{
      t.ok(err, 'Error returned to callback')
      t.type(err, 'Error', 'Has type - Error.')
    })
  }, 'Failed testing for env vars does not throw.')

  t.end()
})

tap.test('Start Hook', (t) => {
  t.doesNotThrow(function() {
    try {
      ApplicationEnv.plugin.start.bind({options: {checkExistence:[]}})(()=>{})
    }
    catch(e){
      console.log(e);
    }
  }, 'Does not throw.')
  t.end()
})

tap.test('Stop Hook', (t) => {

  t.doesNotThrow(function() {
    try {
      ApplicationEnv.plugin.stop.bind({options: {checkExistence:[]}})(()=>{})
    }
    catch(e){
      console.log(e);
    }
  }, 'Does not throw.')
  t.end()
})