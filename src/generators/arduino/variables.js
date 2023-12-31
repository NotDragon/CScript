/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Arduino.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.variables');

goog.require('Blockly.Arduino');


Blockly.Arduino.variables_get = function() {
  // Variable getter.
  var code = Blockly.Arduino.nameDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.variables_declare = function(workspace) {

  // Variable setter.
  var dropdown_type = this.getFieldValue('TYPE');

  var argument0 = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || (dropdown_type === 'words'? '""': 0);

  var varName = Blockly.Arduino.nameDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);

  // for(let i of workspace.workspace.variableMap.variableMap){
	// for(let j of i[1]){
	// 	if(j.id_ === this.getFieldValue('VAR')){
	// 		j.type = (dropdown_type === 'words'? 'String': 'int');
	// 		break;
	// 	}
	// }
  // }


  Blockly.Arduino.setups_['setup_var' + varName] = varName + ' = ' + argument0 + ';\n';
  return '';
};

Blockly.Arduino.variables_set = function(workspace) {
  // Variable setter.
  var argument0 = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';

  var varName = Blockly.Arduino.nameDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);

  return varName + ' = ' + argument0 + ';\n';
};
