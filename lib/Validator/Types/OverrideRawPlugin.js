/**
 * @file OverrideRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('pom-framework-utils').lodash
const CommonRawPlugin = require('./CommonRawPlugin')

/**
 *
 * @module OverrideRawPlugin
 */

module.exports = class OverrideRawPlugin extends CommonRawPlugin{
  constructor(pluginModule){
    super(pluginModule)
    this.override = this.checkArgs(pluginModule.loaded) && this.validOverride(pluginModule.loaded.override);
    // this.options = null
  }

  validOverride(override){
    if(!_.isObject(override) || !_.keys(override).length) {
      this.valid = false;
      this.Errors.push(new Error('Does not contain an override property.'));
      return false
    }
    return override
  }

  isOverride(){
    return true
  }
}