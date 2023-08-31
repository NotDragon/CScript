import { writeTextFile, BaseDirectory, readTextFile } from '@tauri-apps/api/fs'
import { appWindow, WebviewWindow } from '@tauri-apps/api/window';
import * as En from "blockly/msg/en.js";
import * as Gr from "blockly/msg/el.js";
import * as Fr from "blockly/msg/fr.js";
import * as De from "blockly/msg/de.js";
import * as Es from "blockly/msg/es.js";
import * as Ru from "blockly/msg/ru.js";
async function updateSettings(){
	const settings = JSON.parse(await readTextFile('settings.json', { dir: BaseDirectory.AppData }));

	switch(settings.theme){
		case 'dark':
			for(let i = 0; i < document.querySelector('#theme_form').theme.length; i++){
				if(document.querySelector('#theme_form').theme[i].value === 'dark'){
					document.querySelector('#theme_form').theme[i].checked = true;
				}
			}
			document.getElementsByTagName('body')[0].style.backgroundColor = '#1e1e1e';
			document.getElementsByTagName('body')[0].style.color = '#ffffff';
			break;
		case 'light':
			for(let i = 0; i < document.querySelector('#theme_form').theme.length; i++){
				if(document.querySelector('#theme_form').theme[i].value === 'light'){
					document.querySelector('#theme_form').theme[i].checked = true;
				}
			}
			document.getElementsByTagName('body')[0].style.backgroundColor = '#ffffff';
			document.getElementsByTagName('body')[0].style.color = '#000000';
			break;
	}

	for(let i of document.querySelector('#lang')){
		if(i.value === settings.lang){
			i.selected = true;
		}
	}

}

document.getElementById('apply').addEventListener('click', async () => {
	await console.log(`lang: ${document.querySelector(`#lang`).value}`);
	await writeTextFile({ path: 'settings.json', contents: JSON.stringify({
			theme: document.querySelector('input[name="theme"]:checked').value,
			lang: document.querySelector(`#lang`).value
		}) }, { dir: BaseDirectory.AppData });
	await WebviewWindow.getByLabel('main').emit('close');
});

updateSettings();
appWindow.center();