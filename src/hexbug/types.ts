export type Direction = "EAST" | "SOUTH_EAST" | "SOUTH_WEST" | "WEST" | "NORTH_WEST" | "NORTH_EAST";

export interface HexPattern {
    direction: Direction;
    signature: string;
}

export interface HexBugRegistry {
    mods: { [id: string]: ModInfo };
    patterns: { [name: string]: HexBugPatternInfo };
    special_handlers: { [name: string]: SpecialHandlerInfo };

    // probably don't need these
    categories: any;
    entries: any;
    pages: any;
    recipes: any;

    // TODO: switch to using this instead of numbers_2000.json
    pregenerated_numbers: any;
}

export type Modloader = "Fabric" | "Forge" | "NeoForge" | "Quilt";

export interface SourceInfo {
    type: "github" | "codeberg";
    author: string;
    repo: string;
    commit: string;
}

export interface ModInfo {
    // StaticModInfo
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    curseforge_slug: string | null;
    modrinth_slug: string | null;
    modloaders: Modloader[];

    // DynamicModInfo
    version: string;
    book_url: string;
    book_title: string;
    book_description: string;
    source: SourceInfo;

    pattern_count: number;
    documented_pattern_count: number;
    special_handler_count: number;
    first_party_operator_count: number;
    third_party_operator_count: number;

    category_count: number;
    entry_count: number;
    linkable_page_count: number;
    recipe_count: number;
}

export interface HexBugPatternInfo {
    id: string;
    name: string;
    direction: Direction;
    signature: string;
    is_per_world: boolean;
    display_only: boolean;
    display_as: string | null;
    operators: PatternOperator[];
}

export interface PatternOperator {
    description: string | null;
    inputs: string | null;
    outputs: string | null;
    book_url: string | null;
    mod_id: string;
}

export interface SpecialHandlerInfo {
    id: string;
    raw_name: string;
    base_name: string;
    operator: PatternOperator | null;
}

// i hate it here
export interface RegistryPatternInfo {
    id: string;
    modid: string;
    idPath: string;
    translation: string;
    // null only for special handlers
    direction: Direction | null;
    signature: string | null;
    isPerWorld: boolean;
    operators: PatternOperator[];
}

export const MACRO_MOD_ID = "macro";


export type PatternInfo = RegistryPatternInfo;

export type PatternLookup<T extends PatternInfo> = { [translation: string]: T };

export type ShorthandLookup = { [shorthand: string]: string };
