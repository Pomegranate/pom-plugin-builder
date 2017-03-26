/**
 * @file PluginValidator
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const RawPlugin = require('./Validator');
const fs = require('fs');
const path = require('path');
const _ = require('pom-framework-utils').lodash
const debug = require('pom-framework-utils').debug('pom:pluginFinder');

/**
 * Creates Raw Plugins
 * @module PluginValidator
 */

module.exports = function(pluginData, FrameworkInjector){
  let Options = FrameworkInjector.get('Options')
  let Output = FrameworkInjector.get('Output')
  let FrameworkLogger = FrameworkInjector.get('FrameworkLogger')
  FrameworkLogger.log(Output.titleAnnounce(`Requiring ${pluginData.length} Plugin modules.`));

  let RawPlugins = _.chain(pluginData)
    .map(function(plugin){
      let loadedPlugin = attemptLoad(plugin.require);
      plugin.loaded = loadedPlugin;
      //refactor this to be a recursive call that allows multiple plugin modules to export
      //Other multiple plugin modules.

      return unrollPlugin(plugin)
    })
    .flattenDeep()
    .filter(Boolean)
    .value()

  return RawPlugins
}


function attemptLoad(requirePath){
  try {
    debug('Trying stock require. ' + requirePath)
    return require(requirePath);
  }
  catch(e) {
    debug('Stock require failed')
  }
  try {
    debug('Trying parent require. ' + requirePath)
    let prequire = require('parent-require');
    return prequire(requirePath)
  }
  catch(e){
    debug('Parent require failed')
  }
  try{
    debug('Trying to join process.cwd() with local node modules. ' + requirePath)
    return require(path.join(process.cwd(), 'node_modules', requirePath))
  }
  catch(e){
    debug('All loading methods failed for this plugin. ' + requirePath)
    e.failedRequire = requirePath
    throw e
  }
}

/**
 * Creates arrays of plugins from multiple plugin modules.
 * @param plugin
 * @param layers
 * @returns {Array|TResult[]|boolean[]}
 */
function unrollPlugin(plugin, layers){
  // console.log(plugin.loaded);
  if(_.isArray(plugin.loaded)){

    /* This looks at an array of plugins and determines if the first index in the array
     * is a a string, if it is it is a named nested plugin, and this string will be used
     * as the parent plugin name.
     *
     * for example syntax.
     * see: test/mocks/unit/PluginValidator/multiplePlugins
     */
    let overrideName = _.chain(plugin.loaded).remove(function(pin){
      return _.isString(pin)
    }).first().value()

    return _.map(plugin.loaded, function(mPlugin){

      if(overrideName){
        plugin.moduleName = overrideName
      }

      let multiplePlugin = _.chain(plugin).clone().omit('loaded').value();
      multiplePlugin.loaded = mPlugin;
      if(!multiplePlugin.loaded.metadata) {
        multiplePlugin.loaded.metadata = {}
      }
      multiplePlugin.loaded.metadata.multiple = true;

      //TODO: Where is this even used?
      // multiplePlugin.loaded.metadata.declaredName = multiplePlugin.loaded.metadata.name;

      return unrollPlugin(multiplePlugin, layers)
    })
  }
  return RawPlugin(plugin, layers);
}