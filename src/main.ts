import {App, Editor, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PatternRendererPluginSettings, SampleSettingTab} from "./settings";
import init_renderer, { draw_bound_hex_grid, draw_bound_square_grid, EndPoint, GridOptions, PatternVariant, PatternVariantArray} from 'hex_renderer_javascript';
//@ts-ignore
import hex_renderer_wasm from "hex_renderer_javascript/hex_renderer_javascript_bg.wasm";
import {getOptions} from "options"
import { ok } from 'assert';

const gradient = {
    line_thickness: 0.12,
    center_dot: {
        type: "None"
    },
    pattern_options: {
        type: "Uniform",
        lines: {
            type: "Gradient",
            colors: [
                [214, 9, 177, 255],
                [108, 25, 140, 255],
                [50, 102, 207, 255],
                [102, 110, 125, 255],
            ],
            bent: true,
            segments_per_color: 15,
        },
        intersections: {
            type: "UniformPoints",
            point: {
                type: "Single",
                marker: {
                    color: [255, 255, 255, 255],
                    radius: 0.07,
                }
            }
        }
    },
}

export default class PatternRendererPlugin extends Plugin {
	settings: PatternRendererPluginSettings;
	async onload() {
		await this.loadSettings();

		/*const importObject = {
			// @ts-ignore
 			my_namespace: { imported_func: (arg) => console.log(arg) },
		};

		WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
  			(_obj) => {
				await init_renderer(_obj.instance);
			}
		);*/
		
		await init_renderer(hex_renderer_wasm);

		const start_point : EndPoint = {
		type: "BorderedMatch",
		match_radius: 0.08,
		border: {
			color: [168, 30, 227, 255],
			radius: 0.24
		}
	}
	const options = getOptions(false, true)

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Sample', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.registerMarkdownCodeBlockProcessor('patterns',(source : string, element : HTMLElement, ctx : MarkdownPostProcessorContext) => {
			const patterns = source.split("\n").filter((patterns) => patterns.length > 0);

			const patternVariants : PatternVariantArray = patterns.map((value: string) => {
				const val = value.replace(RegExp("^\\s*"),"")
				const info = val.split(",");
				ok(info[0]);ok(info[1]);
				const pattern : PatternVariant = {
					direction: info[0],
					angle_sigs: info[1],
					great_spell: false
				}
				return pattern
			});

			const canvas = element.createEl('canvas');
			const context = canvas.getContext("2d");
			ok(context)
			const png : Uint8Array = draw_bound_square_grid(options, patternVariants, 15, 0.5, 0.01, 0.01, window.innerWidth, (window.innerHeight / 10) * patternVariants.length)
			ok(png)
			ok(png.buffer)
			const clampedData = new Uint8ClampedArray(png);
			// const imageData = new ImageData(clampedData, canvas.width, canvas.height);
			const a = element.createEl("img");
			
			a.src = URL.createObjectURL(
  				new Blob([clampedData.buffer], { type: 'image/png' } /* (1) */)
			);
			//context.putImageData(imageData, 0, 0)

			element.replaceWith(a)
		})

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample editor command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PatternRendererPlugin>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
