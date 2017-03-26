/**
 * @file Common
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('pom-framework-utils').lodash
const debug = require('debug')('pom:CommonRawPlugin')
/**
 *
 * @module Common
 */


module.exports = class CommonRawPlugin {
  constructor(pluginModule){
    this.pluginModule = pluginModule
    this.availableTypes = ['dynamic', 'factory', 'installer', 'instance', 'merge', 'none', 'action', 'override', 'service'];
    this.systemPlugin = pluginModule.systemPlugin || false
    this.valid = true;
    this.Errors = [];
    this.moduleName = this._validateModuleName(pluginModule.moduleName)

    this.options = this.checkArgs(pluginModule.loaded) && this.validOptions(pluginModule.loaded.options);
    this.metadata = this.checkArgs(pluginModule.loaded) && this.validMetadata(pluginModule.loaded.metadata)
    this.plugin = this.checkArgs(pluginModule.loaded) && this.validHooks(pluginModule.loaded.plugin);
    this.errors = this.checkArgs(pluginModule.loaded) && this.validErrors(pluginModule.loaded.errors);
    debug(this.Errors);
  }

  getDefaultOptions(){
    return this.options
  }

  isInstaller() {
    return false
  }

  isOverride() {
    return false
  }

  isValid(){
    return this.valid;
  }

  hasErrors(){
    return !!(this.Errors.length);
  }

  getErrors(){
    return {
      moduleName: this.moduleName,
      Errors: this.Errors
    }
  }

  checkArgs(exists){
    return !!(exists)
  }

  /**
   * Validates a loaded plugins exported option object.
   * @param {Object} options
   * @returns {Object | Boolean}
   */
  validOptions(options) {

    if(!_.isObject(options) || !_.keys(options).length){
      return false
    }
    return options
  }

  /**
   * Validates a loaded plugins exported metadata object.
   *
   * @param {Object} metadata
   * @returns {Object | Boolean}
   */
  validMetadata(metadata) {
    if(!_.isObject(metadata) || !_.keys(metadata).length) {
      this.valid = false;
      this.Errors.push(new Error('Metadata missing or invalid'));
      return false
    }
    metadata.name = this.validDeclaredName(metadata.name);
    metadata.type = this.validType(metadata.type);
    if(!metadata.name || !metadata.type){
      return false
    }
    return metadata
  }

  /**
   * Validates a loaded plugins exported plugin object.
   *
   * @param {Object} plugin
   * @returns {Object | Boolean}
   */
  validHooks(plugin) {
    var methods = ['load', 'start', 'stop'];
    var missing = [];
    if(!_.isObject(plugin) || !_.keys(plugin).length) {
      this.valid = false;
      this.Errors.push(new Error('Does not contain a plugin property'));
      return false
    }
    var valid = _.chain(methods)
      .map(function(v) {
        var isFn = _.isFunction(plugin[v]);
        if(!isFn) missing.push(v)
        return isFn
      })
      .every(Boolean)
      .value()
    if(valid) {
      return plugin
    }
    this.valid = false;
    this.Errors.push(new Error('Missing hook methods: ' + missing.join(', ') + '.'));
    return false
  }

  /**
   * Validates a loaded plugins exported errors object.
   *
   * @param {Object} errors
   * @returns {Object | Boolean}
   */
  validErrors(errors) {
    if(_.isObject(errors)) {
      var e = _.pickBy(errors, function(err) {
        return (err.prototype && err.prototype.name === 'Error')
      });
      return e
    }
    return false
  }

  validDeclaredName(name) {
    if(!name) {
      this.valid = false;
      this.Errors.push(new Error('metadata.name missing'))
      return false
    }
    return name
  }


  validType(type) {
    if(!type) {
      this.valid = false;
      this.Errors.push(new Error('metadata.type missing, must be one of the following ' + this.availableTypes.join(', ')))
      return false
    }
    if(!_.includes(this.availableTypes, type)) {
      this.valid = false
      this.Errors.push(new Error('metadata.type "' + type + '" must be one of the following ' + this.availableTypes.join(', ')))
      return false
    }
    return type
  }

  _validateModuleName(name){
    if(!name){
      this.valid = false;
      this.Errors.push(new Error('Plugin is missing modulename'))
      return false
    }
    return name
  }

  getType(){
    return this.metadata.type;
  }

  getCustomErrors(){
    return this.errors
  }

  getHooks(){
    return this.plugin
  }


}