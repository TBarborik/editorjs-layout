import {EditorJSLayoutError} from "./EditorJSLayoutError";
import type {
	LayoutBlockToolConfig,
	LayoutBlockToolDispatchData
} from "./LayoutBlockTool";
import {renderItem} from "./item";
import type {LayoutBlockItemData, ValidatedLayoutBlockItemData} from "./item";
import type {LayoutBlockItemContentData} from "./itemContent";
import type {OutputData} from '@editorjs/editorjs';

interface LayoutBlockContainerData {
	type: "container";
	id: Element["id"];
	className: Element["className"];
	style: CSSStyleDeclaration["cssText"];
	children: (LayoutBlockContainerData | LayoutBlockItemData)[];
}

interface ValidatedLayoutBlockContainerData extends LayoutBlockContainerData {
	children: (
		| ValidatedLayoutBlockContainerData
		| ValidatedLayoutBlockItemData
		)[];
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

const renderContainer = ({
							 data,
							 itemContentData,
							 ...context
						 }: RenderContainerProps) => {

	const wrapper = document.createElement("div");
	let draggedElement: HTMLElement | null = null;

	wrapper.id = data.id;
	wrapper.className = data.className;
	wrapper.style.cssText = data.style;

	const handleDragStart = (ev: DragEvent) => {
		let el = ev.target as HTMLElement | null;
		while (el && !el.draggable)
			el = el.parentElement;

		el?.classList.add("is-dragging");
		draggedElement = el;
	};

	const handleDragOver = (ev: DragEvent) => {
		ev.preventDefault();

		let el = ev.target as HTMLElement | null;
		while (el !== null && el.parentElement !== wrapper)
			el = el.parentElement;

		if (el !== null && draggedElement && el !== draggedElement) {
			const cells = Array.from(wrapper.children) as HTMLElement[];

			if (cells.indexOf(el) > cells.indexOf(draggedElement)) {
				el.after(draggedElement);
			} else {
				el.before(draggedElement);
			}
		}
	};

	const handleDragEnd = (ev: DragEvent) => {
		if (draggedElement) {
			draggedElement.classList.remove("is-dragging");
			draggedElement.querySelectorAll(".btn").forEach(btn => btn.classList.remove("d-none"));

			let newOrder = Array.from<HTMLElement>(wrapper.children as unknown as HTMLElement[]).map((child) => child.dataset.contentId as string);

			context.dispatchData(({itemContent, layout}: any) => {
				return {
					itemContent: Object.fromEntries(
						Object.entries<Pick<OutputData, "blocks">>(itemContent).map(
							([key, data]) => [(newOrder.indexOf(key) + 1).toString(), data]
						)
					),
					layout
				};
			});

			const mouseUpEvent = new MouseEvent('mouseup', {
				bubbles: true,
				cancelable: true,
				view: window
			});

			document.body.dispatchEvent(mouseUpEvent);
		}
	};

	data.children.forEach((child) => {
		let childElement: HTMLDivElement;

		switch (child.type) {
			case "container": {
				childElement = renderContainer({
					...context,
					data: child,
					itemContentData
				});

				break;
			}

			case "item": {
				childElement = renderItem({
					...context,
					data: child,
					itemContentData
				});

				break;
			}

			default: {
				const exhaustiveCheck: never = child;

				throw new EditorJSLayoutError();
			}
		}

		childElement.draggable = true;
		childElement.addEventListener("dragstart", handleDragStart.bind(this));
		childElement.addEventListener("dragover", handleDragOver.bind(this));
		childElement.addEventListener("dragend", handleDragEnd.bind(this));

		wrapper.append(childElement);
	});

	return wrapper;
};

export {renderContainer};
export type {
	LayoutBlockContainerData,
	RenderContainerProps,
	RenderContext,
	ValidatedLayoutBlockContainerData
};
