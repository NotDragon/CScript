import * as Blockly from 'blockly';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
	{
		"type": "tankbot_rotate",
		"message0": "Rotate %1 degrees to the %2",
		"args0": [
			{
				"type": "field_number",
				"name": "NUM",
			},
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["right", "right"],
					["left", "left"]
				]
			}
		],

		"previousStatement": null,
		"nextStatement": null,
		'style': 'tankbot_blocks',
	},
	{
		"type": "tankbot_toggle_led",
		"message0": "Turn LED %1 %2",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["1", "1"],
					["2", "2"],
					["3", "3"],
					["4", "4"]
				]
			},
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["On", "On"],
					["Off", "Off"]
				]
			}
		],
		"output": null,
		'style': 'tankbot_blocks',
	},
	{
		"type": "tankbot_distance",
		"message0": "distance",
		"output": null,
		'style': 'tankbot_blocks',
	},
	{
		"type": "tankbot_move",
		"message0": "Move %1 steps %2",
		"args0": [
			{
				"type": "field_number",
				"name": "NUM",
			},
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["forward", "fw"],
					["backward", "bw"]
				]
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"output": "Number",
		'style': 'tankbot_blocks',
	},
	{
		"type": "variables_declare",
		"message0": "Declare %1 that stores %2 with the value of %3",
		"args0": [
			{
				"type": "field_variable",
				"name": "VAR",
				"variable": "%{BKY_VARIABLES_DEFAULT_NAME}"
			},
			{
				"type": "field_dropdown",
				"name": "TYPE",
				"options": [
					["words", "words"],
					["numbers", "numbers"]
				]
			},
			{
				"type": "input_value",
				"name": "VALUE"
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		'style': 'arduino_blocks'
	}
]);