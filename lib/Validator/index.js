/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('pom-framework-utils').lodash
const DependencyRawPlugin = require('./Types/DependencyRawPlugin')
const InstallerRawPlugin = require('./Types/InstallerRawPlugin')
const OverrideRawPlugin = require('./Types/OverrideRawPlugin')

/**
 *
 * @module index
 */

module.exports = function(pluginModule){
  let type = _.has(pluginModule, 'loaded.metadata.type') && pluginModule.loaded.metadata.type

  if(type === 'override'){
    return new OverrideRawPlugin(pluginModule)
  }

  if(type === 'installer'){
    return new InstallerRawPlugin(pluginModule)
  }

  return new DependencyRawPlugin(pluginModule)
}