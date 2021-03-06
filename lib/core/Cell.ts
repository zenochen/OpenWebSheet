export class Cell {
    public colSpan: number = 1;
    public rowSpan: number = 1;

    private formattedValue: string;
    private evaluatedValue;
    private _columnId: number;
    private _rowId: number;
    private _value: any = null;

    public constructor(columnId: number, rowId: number) {
        this._columnId = columnId;
        this._rowId = rowId;
    }

    // merged cell has following value
    public reference: Cell = null;

    public get isMerged() {
        return this.reference !== null;
    }

    public get columnId() {
        return this._columnId;
    }

    public get rowId() {
        return this._rowId;
    }

    public get label() {
        return this.formattedValue;
    }

    public get value() {
        return this._value;
    }

    public set value(newValue) {
        this.update(newValue, newValue);
    }

    public get top() {
        if (this.isMerged) {
            return this.reference.top
        }

        return this.rowId;
    }

    public get left() {
        if (this.isMerged) {
            return this.reference.left
        }

        return this.columnId
    }

    public get bottom() {
        if (this.isMerged) {
            return this.reference.bottom
        }

        return this.rowId + this.rowSpan
    }

    public get right() {
        if (this.isMerged) {
            return this.reference.right
        }

        return this.columnId + this.colSpan
    }

    public update(newValue, evaluated): void {
        this._value = newValue;
        this.evaluatedValue = evaluated;
        this.format();
    }

    private format() {
        this.formattedValue = this.evaluatedValue;
    }

    static from(data): Cell {
        let cell = new Cell(data.columnId, data.rowId);
        cell.colSpan = data.colSpan;
        cell.rowSpan = data.rowSpan;
        cell.formattedValue = data.formattedValue;
        cell.evaluatedValue = data.evaluatedValue;
        cell._columnId = data._columnId;
        cell._rowId = data._rowId;
        cell._value = data._value;
        cell.reference = data.reference && this.from(data.reference);
        return cell;
    }

    to() {
        return {
            colSpan: this.colSpan,
            rowSpan: this.rowSpan,
            formattedValue: this.formattedValue,
            evaluatedValue: this.evaluatedValue,
            _columnId: this._columnId,
            _rowId: this._rowId,
            _value: this._value,
            reference: this.reference && this.reference.to()
        };
    }
}