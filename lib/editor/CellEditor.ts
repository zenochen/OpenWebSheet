import { OpenDocument } from "../core/Document";
import { UIHandlerController } from "./UIHandlerControler";
import { ColumnHeaderHeight, RowHeaderWidth, SheetTitleHeight, COLOR_1, COLOR_2 } from "../common/constants";
import { Cell } from "../core/Cell";
import { Sheet } from "../core/Sheet";
import { TextAlign } from "../core/Appearance";

/**
 * Created by SiamandM on 6/23/2016.
 */
///<reference path="UIHandler.ts"/>

export class CellEditor {

    private websheet:OpenDocument;
    private editorArea:HTMLDivElement;
    private selectionElement:HTMLElement;
    private editorElement:HTMLInputElement;
    private anchorElement:HTMLSpanElement;

    constructor(public controler:UIHandlerController) {
        this.websheet = controler.websheet;

        this.initialize();
        this.select();
    }

    initialize() {
        this.editorArea = document.createElement('div');
        this.editorArea.style.position = 'absolute';
        this.editorArea.style.top = ColumnHeaderHeight + 'px';
        this.editorArea.style.left = RowHeaderWidth + 'px';
        this.editorArea.style.bottom = SheetTitleHeight + 'px';
        this.editorArea.style.right = '0px';
        this.editorArea.style.overflow = 'visible';
        this.controler.renderer.Element.appendChild(this.editorArea);

        this.selectionElement = document.createElement('div');
        this.selectionElement.style.position = 'absolute';
        this.selectionElement.style.border = `solid 2px ${COLOR_1}`;
        this.selectionElement.style.overflow = 'hidden';
        this.selectionElement.style.background = 'rgba(0,0,0,.1)';
        this.selectionElement.style.transitionDuration = '.1s';
        this.editorArea.appendChild(this.selectionElement);

        this.editorElement = document.createElement('input');
        this.editorElement.type ='text';
        this.editorElement.style.zIndex = '10000';
        this.editorElement.style.position = 'absolute';
        this.editorElement.style.background = '#fff';
        this.editorElement.style.textIndent = '3px';
        this.editorElement.style.border = 'none';
        this.editorElement.addEventListener('keypress',(evt) => this.onKeyPress(evt));
        this.editorElement.addEventListener('keydown',(evt) => this.onKeyDown(evt));
        this.selectionElement.appendChild(this.editorElement);

        this.anchorElement = document.createElement('span');
        this.anchorElement.style.position='absolute';
        this.anchorElement.style.right='0';
        this.anchorElement.style.bottom='0';
        this.anchorElement.style.width='6px';
        this.anchorElement.style.height='6px';
        this.anchorElement.style.borderRadius='2px';
        this.anchorElement.style.border='solid 1px #fff';
        this.anchorElement.style.background= COLOR_2;
        this.anchorElement.style.zIndex='10000';
        this.anchorElement.style.cursor='cell';
        this.editorArea.appendChild(this.anchorElement);

        this.websheet.addOnChange(() => {
             const value= this.websheet.ActiveSheet.SelectedValue;
             if(value != this.Value) {
                 this.Value = value
             }

             this.updateEitorAppearance();
             this.select(true);
        })

    }

    private onKeyDown(evt:KeyboardEvent) {
        if(evt.key == 'Tab') {
            this.deselect();
            if(evt.shiftKey) {
                this.websheet.ActiveSheet.selectPreviousColumnCell();
            } else {
                this.websheet.ActiveSheet.selectNextColumnCell();
            }
            evt.preventDefault();
            this.select(true);
        } else if (evt.key == 'ArrowRight' || evt.key == 'ArrowLeft' || evt.key == 'ArrowUp' || evt.key == 'ArrowDown' ) {
            this.deselect();
            if (evt.key == 'ArrowRight') {
                this.websheet.ActiveSheet.selectNextColumnCell();
            } else if(evt.key == 'ArrowLeft') {
                this.websheet.ActiveSheet.selectPreviousColumnCell();
            } else if(evt.key == 'ArrowUp') {
                this.websheet.ActiveSheet.selectPreviousRowCell();
            } else if(evt.key == 'ArrowDown') {
                this.websheet.ActiveSheet.selectNextRowCell();
            }
            evt.preventDefault();
            this.select(true);
        }
    }

    private onKeyPress(evt:KeyboardEvent) {
        if(evt.key == 'Enter') {
            this.deselect();
            if(evt.shiftKey) {
                this.websheet.ActiveSheet.selectPreviousRowCell();
            } else {
                this.websheet.ActiveSheet.selectNextRowCell();
            }
            this.select(true);
        }
    }

    disableAnimation() {
        this.selectionElement.style.transitionDuration = '';
        this.anchorElement.style.transitionDuration = '';
    }

    enableAnimation() {
        this.selectionElement.style.transitionDuration = '.1s';
        this.anchorElement.style.transitionDuration = '.1s';
    }

    public get Value(){
        if(this.editorElement.value=="") 
            return null;

        return this.editorElement.value;
    }

    public set Value(newValue){
        this.editorElement.value = newValue;
    }

    public get IsDirty(){
        let cell = this.getCurrentCell();
        return (cell.value != this.Value)
    }

    public deselect() {
        let cell = this.getCurrentCell();
        if(this.IsDirty) {
            this.controler.websheet.execCommand('change-value', cell.columnId, cell.rowId, this.Value)
        }
    }

    private getCurrentCell(){
        let sheet = this.controler.websheet.ActiveSheet;
        let selection = sheet.selection;
        return sheet.getCell(selection.columnId, selection.rowId) || new Cell(selection.columnId,selection.rowId); 
    }

    private getCurrentAppearance(){
        let sheet = this.controler.websheet.ActiveSheet;
        let selection = sheet.selection;
        return sheet.getAppearance(selection.columnId, selection.rowId);
    }

    private getTextAlign(textAlign:TextAlign) {
        if(textAlign == TextAlign.Center) return 'center';
        if(textAlign == TextAlign.Left) return 'left';
        if(textAlign == TextAlign.Right) return 'right';
        return '';
    }

    public updateEitorAppearance (){
        let app = this.getCurrentAppearance();
        
        this.editorElement.style.textAlign = this.getTextAlign(app.textAlign);
        this.editorElement.style.fontStyle = app.italic ? 'italic':'';
        this.editorElement.style.fontWeight = app.bold?'bold':'';
        this.editorElement.style.background = app.background;
        this.editorElement.style.fontFamily = app.fontName;
        this.editorElement.style.fontSize = `${app.fontSize}px`;
        this.editorElement.style.color = app.text;
        this.editorElement.style.textDecoration = app.underline ? 'underline':'';
    }

    public select(animation = true) {
        if (animation) {
            this.enableAnimation();
        } else {
            this.disableAnimation();
        }

        this.updateEitorAppearance();

        let sheet = this.controler.websheet.ActiveSheet;
        let selection = sheet.selection;

        let x1 = sheet.getColumnLeft(selection.left);
        let y1 = sheet.getRowTop(selection.top);
        let x2 = sheet.getColumnRight(selection.right);
        let y2 = sheet.getRowBottom(selection.bottom);
        
        let w = x2 - x1;
        let h = y2 - y1;

        this.selectionElement.style.left = (x1 - 2) + 'px';
        this.selectionElement.style.top = (y1 - 2) + 'px';
        this.selectionElement.style.width = (w - 2) + 'px';
        this.selectionElement.style.height = (h - 2) + 'px';

        let selectedCell = this.getCurrentCell();

        let editorY = sheet.getRowTop(selection.rowId);
        let editorX = sheet.getColumnLeft(selection.columnId);
        
        this.editorElement.style.left = (editorX - x1) + 'px';
        this.editorElement.style.top = (editorY - y1) + 'px';
        this.editorElement.style.width = (sheet.getCellWidth(selectedCell) - 3) + 'px';
        this.editorElement.style.height = (sheet.getCellHeight(selectedCell) - 3) + 'px';
        this.editorElement.value = selectedCell.value;
        this.editorElement.focus();

        this.anchorElement.style.left = `${x2-5}px`;
        this.anchorElement.style.top = `${y2-5}px`;
        
    }

}