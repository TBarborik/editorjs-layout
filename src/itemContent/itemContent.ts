import type {OutputData} from "@editorjs/editorjs";
import {v4 as uuidv4} from "uuid";
import type {RenderContext} from "../container";
import {createDialog} from "./createDialog";

interface LayoutBlockItemContentData {
	[index: string]: Pick<OutputData, "blocks"> | undefined;
}

interface ValidatedLayoutBlockItemContentData
	extends LayoutBlockItemContentData {
}

interface RenderItemContentProps extends RenderContext {
  data: OutputData;
  itemContentId: string;
}

const renderItemContent = ({
  EditorJS,
  data,
  dispatchData,
  editorJSConfig,
  itemContentId,
  readOnly,
}: RenderItemContentProps) => {
  const editorJSHolderID = uuidv4();
  const wrapper = document.createElement("div");
  wrapper.style.height = "100%";

  wrapper.id = editorJSHolderID;

	if (readOnly) {
		wrapper.classList.add("read-only");
	} else {
		wrapper.addEventListener("click", () => {
			if (wrapper.parentElement!.classList.contains("is-dragging"))
				return;

			const dialog = createDialog({
				EditorJS,
				data,
				editorJSConfig,
				onClose: async ({editorJSData}: any) =>
					dispatchData(({itemContent, layout}: any) => ({
						itemContent: {
							...itemContent,
							[itemContentId]: {
								blocks: editorJSData.blocks
							}
						},
						layout: layout
					}))
			});

			dialog.show();
		});
	}

	new EditorJS({
		...editorJSConfig,
		holder: editorJSHolderID,
		data,
		minHeight: 0,
		readOnly: true,
	});

	const styleElement = document.createElement("style");
	styleElement.textContent = `
    #${CSS.escape(editorJSHolderID)} {
      cursor: pointer;
    }

    #${CSS.escape(editorJSHolderID)}.read-only {
      cursor: unset;
    }

    #${CSS.escape(editorJSHolderID)} .codex-editor__loader {
      display: none;
    }

    #${CSS.escape(editorJSHolderID)} .codex-editor-overlay {
      display: none;
      pointer-events: none
    }
  `;
	wrapper.append(styleElement);
	return wrapper;
};

export {renderItemContent};
export type {
	LayoutBlockItemContentData,
	RenderItemContentProps,
	ValidatedLayoutBlockItemContentData
};
