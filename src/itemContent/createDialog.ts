import type {OutputData} from "@editorjs/editorjs";
import {v4 as uuidv4} from "uuid";
import type {LayoutBlockToolConfig} from "../LayoutBlockTool";
import {Modal} from "bootstrap";

export const createDialog = ({
								 EditorJS,
								 data,
								 editorJSConfig,
								 onClose
							 }: {
	EditorJS: LayoutBlockToolConfig["EditorJS"];
	data: OutputData;
	editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
	onClose?: (event: { editorJSData: OutputData }) => void;
}) => {
	const bsDialog = document.createElement("div");
	bsDialog.classList.add("modal", "fade");
	bsDialog.role = "dialog";
	bsDialog.tabIndex = -1;
	bsDialog.ariaHidden = "true";
	bsDialog.dataset.backdrop = "static";

	const bsDialogModal = document.createElement("div");
	bsDialogModal.classList.add("modal-dialog", "modal-dialog-centered", "modal-xl", "modal-dialog-scrollable");
	bsDialogModal.role = "document";
	bsDialog.appendChild(bsDialogModal);

	const bsDialogContent = document.createElement("div");
	bsDialogContent.classList.add("modal-content");
	bsDialogModal.appendChild(bsDialogContent);

	//const bsDialogHeader = document.createElement("div");
	//bsDialogHeader.classList.add("modal-header");
	//bsDialogHeader.innerHTML = `
	//	<h5 class="modal-title" id="exampleModalLabel">Modal Title</h5>
	//	<button type="button" class="close" data-dismiss="modal" aria-label="Close">
	//		<i aria-hidden="true" class="ki ki-close"></i>
	//	</button>
	//`;

	const bsDialogFooter = document.createElement("div");
	bsDialogFooter.classList.add("modal-footer");

	const bsCloseButton = document.createElement("button");
	bsCloseButton.classList.add("btn", "btn-secondary");
	bsCloseButton.innerText = document.documentElement.lang === "cs" ? "Zavřít" : "Close";

	const bsSaveButton = document.createElement("button");
	bsSaveButton.classList.add("btn", "btn-primary");
	bsSaveButton.innerText = document.documentElement.lang === "cs" ? "Uložit" : "Save";

	bsDialogFooter.append(bsCloseButton, bsSaveButton);

	const bsDialogBody = document.createElement("div");
	bsDialogBody.classList.add("modal-body");
	bsDialogBody.style.setProperty("max-height", "calc(100vh - 100px)");

	bsDialogContent.append(bsDialogBody, bsDialogFooter);

	const editorJSHolder = document.createElement("div");
	const editorJSHolderID = uuidv4();

	editorJSHolder.id = editorJSHolderID;

	bsDialogBody.append(editorJSHolder);

	const editorJS = new EditorJS({
		...editorJSConfig,
		holder: editorJSHolderID,
		data
	});

	document.body.appendChild(bsDialog);

	const modal = new Modal(bsDialog, {
		backdrop: "static"
	});

	const abortController = new AbortController();

	bsCloseButton.addEventListener("click", () => {
		modal.hide();
	}, {signal: abortController.signal});

	bsSaveButton.addEventListener("click", async () => {
		const editorJSData = await editorJS.save();
		onClose?.({editorJSData});
		modal.hide();
	}, {signal: abortController.signal});

	bsDialog.addEventListener("hidden.bs.modal", async () => {
		editorJS.destroy();
		modal.dispose();
		abortController.abort();

		document.removeChild(bsDialog);
	});

	return modal;
};