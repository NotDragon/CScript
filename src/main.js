import { blocks } from './blocks/customBlocks.ts'
import { writeTextFile, readTextFile, BaseDirectory, createDir, exists } from '@tauri-apps/api/fs'
import { WebviewWindow } from '@tauri-apps/api/window'
import { toolbox } from "./res/toolbox.js";
import { light_theme, dark_theme } from "./res/themes/themes.js";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.css';
import { invoke } from '@tauri-apps/api/tauri';
import { Command } from '@tauri-apps/api/shell';
import { appDataDir } from '@tauri-apps/api/path';
import * as Gr from 'blockly/msg/el';
import * as En from 'blockly/msg/en';
import * as Ru from 'blockly/msg/ru';
import * as Fr from 'blockly/msg/fr';
import * as De from 'blockly/msg/de';
import * as Es from 'blockly/msg/es';

let current_theme = 'dark';
let language = 'en';
let board_fqbn = 'arduino:avr:uno';
let device_port = '/dev/ttyUSB0';

const workspace = Blockly.inject('blocklyDiv', {
	toolbox,
	comments: true,
	renderer: 'thrasos',
	zoom: {
			controls: true,
			startScale: 1.0,
			maxScale: 3,
			minScale: 0.3,
			scaleSpeed: 1.2,
			pinch: true
	},
	trashcan: true,
	toolboxPosition: 'start',
});

const tankbot_defines = `
#define SWITCH_1_PIN 11
#define SWITCH_2_PIN 10
#define SWITCH_3_PIN 9
#define SWITCH_4_PIN 8
#define HEADLIGHT_PIN 3
#define BUZZER_PIN 12
#define IR_LEFT_PIN 4
#define SERVO_LEFT_PIN 2
#define LIGHT_SENSOR_PIN A0
#define DHT11_SENSOR_PIN A1
#define IR_RIGHT_PIN A2
#define SERVO_RIGHT_PIN A3 

`;

let currentIndex = 0;
let maxSaves = 100;
let save= [];

window.open_settings_menu = () => {
	const settings_webview = new WebviewWindow('settings_menu', {
		url: 'src/settings_menu/settings_menu.html',
		title: "Settings",
		width: 500,
		height: 650
	});

	settings_webview.onCloseRequested(async (event) => {
		await updateSettings();
		event.preventDefault();
	});

	settings_webview.listen('close', async (e) => {
		await updateSettings();
		await settings_webview.close();
	});

	settings_webview.once('tauri://error', function (e) {
		console.error(`Failed to open settings menu: ${e.payload}`)
	});
}

window.save_code = async () => {
	await writeTextFile({ path: `Sketch/Sketch.ino`, contents: tankbot_defines + Blockly.Arduino.workspaceToCode(workspace) }, { dir: BaseDirectory.AppData });
}

window.compile = async () => {
	let compile = await new Command('compile', ['compile', '--fqbn', board_fqbn, await appDataDir() + 'Sketch/']);

	compile.on('close', e => {
		console.log(`Uploaded successfully: ${e}`);
	});

	compile.on('error', e => {
		console.error(`Failed to upload: ${e}`);
	});

	compile.stdout.on('data', line => console.log(`command stdout: ${line}`));
	compile.stderr.on('data', line => console.log(`command stderr: ${line}`));

	await compile.spawn();
}

window.upload = async () => {
	await new Command('cd', [await appDataDir() + 'Sketch/']).execute();

	let upload = await new Command('upload', ['upload', '-p', device_port, '--fqbn', board_fqbn]);

	upload.on('close', e => {
		console.log(`Uploaded successfully: ${e}`);
	});

	upload.on('error', e => {
		console.error(`Failed to upload: ${e}`);
	});

	upload.stdout.on('data', line => console.log(`command stdout: ${line}`));
	upload.stderr.on('data', line => console.log(`command stderr: ${line}`));

	await upload.spawn();
}

function main(){
	Blockly.common.defineBlocks(blocks);
	workspace.addChangeListener((e) => {
		if (e.isUiEvent) {
			updateSettings().then();
			return;
		}
		saveToFile(workspace).then(r => console.log('Saved save file'));
		window.save_code().then(r => console.log('Saved sketch'));
		update();
	});

	load().then(r => console.log('Loaded save file'));

	workspace.setTheme(current_theme === 'dark' ? dark_theme: light_theme);
	document.getElementsByTagName('body')[0].style.backgroundColor = current_theme === 'dark' ? '#1e1e1e': '#ffffff';
	document.getElementsByTagName('body')[0].style.color = current_theme === 'dark' ? '#ffffff': '#000000';

	updateSettings().then(r => console.log('Updated settings'));
}

function update(){
	document.querySelector('#code').innerHTML = tankbot_defines + Blockly.Arduino.workspaceToCode(workspace);
	document.querySelectorAll('pre code').forEach((element) => {
		hljs.highlightElement(element);
		element.style.backgroundColor = current_theme === 'dark' ? '#1e1e1e': '#ffffff';
		element.style.color = current_theme === 'dark' ? '#ffffff': '#000000';
	});
}

async function saveToFile(workspace){
	if(currentIndex < maxSaves) {
		save.push(Blockly.serialization.workspaces.save(workspace));
	}else{
		save[currentIndex++] = Blockly.serialization.workspaces.save(workspace);
	}

	if(currentIndex >= maxSaves){
		currentIndex = 0;
	}

	await writeTextFile({ path: `save.json`, contents: JSON.stringify(save) }, { dir: BaseDirectory.AppData });
}

async function load(){
	save = JSON.parse(await readTextFile('save.json', { dir: BaseDirectory.AppData }));
	if(save.length !== 0) {
		Blockly.serialization.workspaces.load(save[save.length - 1], workspace);
	}

}

async function updateSettings(){
	const settings = JSON.parse(await readTextFile('settings.json', { dir: BaseDirectory.AppData }));

	if(current_theme !== settings.theme) {
		current_theme = settings.theme;

		workspace.setTheme(current_theme === 'dark' ? dark_theme : light_theme);
		document.getElementsByTagName('body')[0].style.backgroundColor = current_theme === 'dark' ? '#1e1e1e' : '#ffffff';
		document.getElementsByTagName('body')[0].style.color = current_theme === 'dark' ? '#ffffff' : '#000000';

		document.querySelectorAll('pre code').forEach((element) => {
			hljs.highlightElement(element);
			element.style.backgroundColor = current_theme === 'dark' ? '#1e1e1e' : '#ffffff';
			element.style.color = current_theme === 'dark' ? '#ffffff' : '#000000';
		});
	}

	if(language !== settings.lang){
		language = settings.lang;

		switch (language){
			case 'en':
				Blockly.setLocale(En);
				break;
			case 'gr':
				Blockly.setLocale(Gr);
				break;
			case 'fr':
				Blockly.setLocale(Fr);
				break;
			case 'de':
				Blockly.setLocale(De);
				break;
			case 'es':
				Blockly.setLocale(Es);
				break;
			case 'ru':
				Blockly.setLocale(Ru);
				break;
		}
	}
}

main();