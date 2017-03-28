/**
 * @file PluginFinder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const fs = require('pom-framework-utils').fsExtra;
const _ = require('pom-framework-utils').lodash;
const debug = require('pom-framework-utils').debug('pom:pluginFinder');
const path = require('path');


/**
 *
 * @module PluginFinder
 */

module.exports = function(PackageDependencies, FrameworkInjector){
  let Options = FrameworkInjector.get('Options')
  let FrameworkLogger = FrameworkInjector.get('FrameworkLogger')
  FrameworkLogger.log('Discovering plugins.')


  /*
   * Create the list of prefixes to search for in the available dependencies.
   * Options.prefix is the primary, Options.additionalPrefix are secondary.
   */
  let prefixes = FrameworkInjector.get('Prefixes')//[Options.prefix]

  FrameworkLogger.log(`${prefixes.join(', ')} prefixed plugins will load from ./node_modules`)

  /*
   * Internal plugins included with the framework.
   */
  let frameworkPluginPath = path.join(__dirname, './FrameworkPlugins')

  let FrameworkPlugins = fs.readdirSync(frameworkPluginPath)
    .filter(function(file){
      debug(file)
      return (path.extname(file) === '.js')
    })
    .map(function(file){
      return {
        require: path.join(frameworkPluginPath, file),
        external: false,
        internal: false,
        systemPlugin: true,
        moduleName: path.basename(file, '.js')
      };
    })

  FrameworkLogger.log(`Found ${FrameworkPlugins.length} framework plugins.`)

  /*
   * External plugins derived from package.json dependencies with prefix names.
   */
  let ExternalPlugins = PackageDependencies
    .filter(function(dep) {
      debug(dep);
      return _.some(prefixes, (p) => {
        return dep.indexOf(`${p}-`) === 0
      })
    })
    .map(function(dep){
      return {
        require: dep,
        external: true,
        internal: false,
        systemPlugin: false,
        moduleName: dep
      }
    })

  FrameworkLogger.log(`Found ${ExternalPlugins.length} external plugins.`)


  let InternalPlugins
  if(Options.pluginDirectory) {
    InternalPlugins = fs.readdirSync(Options.pluginDirectory)
      .filter(function(file){
        debug(file)

        //Short circut on the obvious and common case of a standalone plugin file.
        let isJsFile = (path.extname(file) === '.js')
        if(isJsFile) return true

        let possibleDirectoryPath = path.join(Options.pluginDirectory, file)
        let isDirectory = fs.statSync(possibleDirectoryPath).isDirectory()

        // More short circuiting.
        if(isDirectory){
          let reduced = fs.readdirSync(possibleDirectoryPath)
            .reduce((bool, file) => {
              return bool || (file === 'index.js')
            }, false)

          return reduced
        }

        return false
      })
      .map(function(file){
        return {
          require: path.join(Options.pluginDirectory, file),
          external: false,
          internal: true,
          systemPlugin: false,
          moduleName: path.basename(file, '.js')
        };
      })
  } else {
    InternalPlugins = []
  }
  debug(InternalPlugins)
  FrameworkLogger.log(`Found ${InternalPlugins.length} internal plugins.`)

  return _.concat(FrameworkPlugins, ExternalPlugins, InternalPlugins)
}