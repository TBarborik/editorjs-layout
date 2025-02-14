import type EditorJS from "@editorjs/editorjs";
import type { BlockTool, BlockToolConstructorOptions, EditorConfig } from "@editorjs/editorjs";
import type { LayoutBlockContainerData, ValidatedLayoutBlockContainerData } from "./container";
import type { LayoutBlockItemContentData, ValidatedLayoutBlockItemContentData } from "./itemContent";
interface LayoutBlockToolConfig {
    EditorJS: typeof EditorJS;
    editorJSConfig: Omit<EditorConfig, "holder" | "data" | "minHeight" | "readOnly">;
    /** Reserved flag for the future */
    enableLayoutEditing: false;
    enableLayoutSaving: boolean;
    initialData: ValidatedLayoutBlockToolData;
}
interface LayoutBlockToolData {
    itemContent: LayoutBlockItemContentData;
    layout?: LayoutBlockContainerData;
}
interface ValidatedLayoutBlockToolData extends LayoutBlockToolData {
    itemContent: ValidatedLayoutBlockItemContentData;
    layout?: ValidatedLayoutBlockContainerData;
}
interface LayoutBlockToolDispatchData {
    (action: (prevData: {
        itemContent: LayoutBlockItemContentData;
        layout: LayoutBlockContainerData;
    }) => {
        itemContent: LayoutBlockItemContentData;
        layout: LayoutBlockContainerData;
    }): void;
}
declare class LayoutBlockTool implements BlockTool {
    #private;
    static get isReadOnlySupported(): boolean;
    static get shortcut(): string;
    static get toolbox(): {
        icon: string;
        title: string;
    };
    constructor({ config, data, readOnly, }: BlockToolConstructorOptions<LayoutBlockToolData, LayoutBlockToolConfig>);
    render(): HTMLDivElement;
    save(): LayoutBlockToolData;
    validate(data: LayoutBlockToolData): boolean;
    renderWrapper(): void;
}
export { LayoutBlockTool };
export type { LayoutBlockToolConfig, LayoutBlockToolData, LayoutBlockToolDispatchData, ValidatedLayoutBlockToolData, };
