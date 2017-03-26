/**
 * @file DependencyRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const CommonRawPlugin = require('./CommonRawPlugin')

/**
 *
 * @module DependencyRawPlugin
 */

module.exports = class DependencyRawPlugin extends CommonRawPlugin{
  constructor(pluginModule){
    super(pluginModule)

  }
}