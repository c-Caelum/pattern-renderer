import {App, DropdownComponent, PluginSettingTab, Setting} from "obsidian";
import PatternRendererPlugin from "./main";

export interface PatternRendererPluginSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: PatternRendererPluginSettings = {
	mySetting: 'default'
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: PatternRendererPlugin;

	constructor(app: App, plugin: PatternRendererPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Theme')
			.setDesc('The theme for the pattern renderer to use.')
	}
}
