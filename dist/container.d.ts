import type { LayoutBlockToolConfig, LayoutBlockToolDispatchData } from "./LayoutBlockTool";
import type { LayoutBlockItemData, ValidatedLayoutBlockItemData } from "./item";
import type { LayoutBlockItemContentData } from "./itemContent/itemContent";
interface LayoutBlockContainerData {
    type: "container";
    id: Element["id"];
    className: Element["className"];
    style: CSSStyleDeclaration["cssText"];
    children: (LayoutBlockContainerData | LayoutBlockItemData)[];
}
interface ValidatedLayoutBlockContainerData extends LayoutBlockContainerData {
    children: (ValidatedLayoutBlockContainerData | ValidatedLayoutBlockItemData)[];
}
interface RenderContext {
    EditorJS: LayoutBlockToolConfig["EditorJS"];
    dispatchData: LayoutBlockToolDispatchData;
    editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
    readOnly: boolean;
}
interface RenderContainerProps extends RenderContext {
    data: LayoutBlockContainerData;
    itemContentData: LayoutBlockItemContentData;
}
declare const renderContainer: ({ data, itemContentData, ...context }: RenderContainerProps) => HTMLDivElement;
export { renderContainer };
export type { LayoutBlockContainerData, RenderContainerProps, RenderContext, ValidatedLayoutBlockContainerData, };
