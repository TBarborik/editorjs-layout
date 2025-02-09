import type { RenderContext } from "./container";
import type { LayoutBlockItemContentData } from "./itemContent/itemContent";
interface LayoutBlockItemData {
    type: "item";
    id: Element["id"];
    className: Element["className"];
    style: CSSStyleDeclaration["cssText"];
    itemContentId: string;
}
interface ValidatedLayoutBlockItemData extends LayoutBlockItemData {
}
interface RenderItemProps extends RenderContext {
    data: LayoutBlockItemData;
    itemContentData: LayoutBlockItemContentData;
}
declare const renderItem: ({ data, itemContentData, ...context }: RenderItemProps) => HTMLDivElement;
export { renderItem };
export type { LayoutBlockItemData, RenderItemProps, ValidatedLayoutBlockItemData, };
