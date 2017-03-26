/**
 * @file InstallerRawPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('pom-framework-utils').lodash
const CommonRawPlugin = require('./CommonRawPlugin')

/**
 *
 * @module InstallerRawPlugin
 */

module.exports = class InstallerRawPlugin extends CommonRawPlugin{
  constructor(pluginModule){
    super(pluginModule)
    this.installer = this.checkArgs(pluginModule.loaded) && this.validInstaller(pluginModule.loaded.installer);
    // this.options = null
    // this.errors = null
    // this.plugin = null
  }

  /**
   * Override method, prevents Errors from being recorded for missing plugin hooks.
   *
   * @returns {boolean} false
   */
  validHooks(){
    return false
  }

  validInstaller(installer){
    if(!_.isFunction(installer)) {
      this.valid = false;
      this.Errors.push(new Error('Installer property must be a function..'));
      return false
    }
    return installer
  }

  isInstaller(){
    return true
  }
}