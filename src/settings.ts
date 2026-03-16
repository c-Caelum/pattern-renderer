import {App, PluginSettingTab, Setting} from "obsidian";
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
			.setName('Settings #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
