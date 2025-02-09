import type { OutputData } from "@editorjs/editorjs";
import type { RenderContext } from "../container";
interface LayoutBlockItemContentData {
    [index: string]: Pick<OutputData, "blocks"> | undefined;
}
interface ValidatedLayoutBlockItemContentData extends LayoutBlockItemContentData {
}
interface RenderItemContentProps extends RenderContext {
    data: OutputData;
    itemContentId: string;
}
declare const renderItemContent: ({ EditorJS, data, dispatchData, editorJSConfig, itemContentId, readOnly, }: RenderItemContentProps) => HTMLDivElement;
export { renderItemContent };
export type { LayoutBlockItemContentData, RenderItemContentProps, ValidatedLayoutBlockItemContentData, };
