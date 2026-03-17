import {App, Editor, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PatternRendererPluginSettings, SampleSettingTab} from "./settings";
import init_renderer, { draw_bound_hex_grid, draw_bound_square_grid, EndPoint, GridOptions, PatternVariant, PatternVariantArray} from 'hex_renderer_javascript';
//@ts-ignore
import hex_renderer_wasm from "hex_renderer_javascript/hex_renderer_javascript_bg.wasm";
import {makePatternNameRegistry} from "hexbug/registry"
import {getOptions} from "options"
import assert, { ok } from 'assert';

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
		const patternLookup = makePatternNameRegistry(); 

		const start_point : EndPoint = {
		type: "BorderedMatch",
		match_radius: 0.08,
		border: {
			color: [168, 30, 227, 255],
			radius: 0.24
		}
	}
	const options = getOptions(false, true)

		this.registerMarkdownCodeBlockProcessor('patterns',(source : string, element : HTMLElement, ctx : MarkdownPostProcessorContext) => {
			const patterns = source.split("\n").filter((patterns) => patterns.length > 0);

			const patternVariants : PatternVariantArray = [];

			for (var i = 0; i < patterns.length; i++) {
				//@ts-ignore
				const val = patterns[i].replace(RegExp("^\\s*"),"")
				switch(val) {
					case "{":
						patternVariants.push({
							direction: "WEST",
							angle_sigs: "qqq",
							great_spell: false
						});
						break;
					case "}":
						patternVariants.push({
							direction: "EAST",
							angle_sigs: "eee",
							great_spell: false
						});
						break;
					default: 
					const lookup = patternLookup[val]
					if (lookup != null) {
						ok(lookup.direction);ok(lookup.signature);
						patternVariants.push({
							direction: lookup.direction,
							angle_sigs: lookup.signature,
							great_spell: false
						});
					} else {
						const info = val.split(",");
						if (info[0] != null && info[1] != null){
							ok(info[0]);ok(info[1]);
							patternVariants.push({
								direction: info[0],
								angle_sigs: info[1],
								great_spell: false
							});
						}
					}
					break;
				}
			}
			const png : Uint8Array = draw_bound_square_grid(options, patternVariants, 15, 0.5, 0.25, 0.25, window.innerWidth, (window.innerHeight / 9) * patternVariants.length)
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
