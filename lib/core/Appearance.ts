export enum TextAlign {
    Left,
    Right,
    Center
}

export enum BorderStyle {
    SolidThin,
    SolidThick,
    SolidDouble,
    DottedThin,
    DottedThick,
    DashedThin,
    DashedThick,
    DotDashedThin,
    DotDashedThick
}

export class Border {
    public constructor(public color = null) {

    }

    public style: BorderStyle = BorderStyle.SolidThin;

    static from(data): Border {
        let border = new Border();
        border.style = data.style;
        border.color = data.color;
        return border;
    }
}

export class Appearance {
    public textAlign: TextAlign = TextAlign.Left;
    public fontName: any;
    public fontSize: any;
    public textStyle: any;
    public text: any;
    public background: any;
    public horizontalBorder: Border;
    public verticalBorder: Border;

    public get bold() {
        return !!(this.textStyle && this.textStyle.indexOf('bold') != -1);
    }

    private ensureTextStyle() {
        if (!this.textStyle) {
            this.textStyle = '';
        }
    }

    public set bold(value: boolean) {
        this.ensureTextStyle();
        if (this.bold == value) return;
        if (value) this.textStyle = `${this.textStyle} bold`;
        else this.textStyle = this.textStyle.replace('bold', '');
    }

    public get italic() {
        return !!(this.textStyle && this.textStyle.indexOf('italic') != -1);
    }

    public set italic(value: boolean) {
        this.ensureTextStyle();
        if (this.italic == value || !this.textStyle) return;
        if (value) this.textStyle = `${this.textStyle} italic`;
        else this.textStyle = this.textStyle.replace('italic', '');
    }

    public get underline() {
        return !!(this.textStyle && this.textStyle.indexOf('underline') != -1);
    }

    public set underline(value: boolean) {
        this.ensureTextStyle();
        if (this.italic == value || !this.textStyle) return;
        if (value) this.textStyle = `${this.textStyle} underline`;
        else this.textStyle = this.textStyle.replace('underline', '');
    }

    alignTextTo(value: string) {
        if (value.toLowerCase() == "right") {
            this.textAlign = TextAlign.Right;
        }
        else if (value.toLowerCase() == "center") {
            this.textAlign = TextAlign.Center;
        }
        else if (value.toLowerCase() == "left") {
            this.textAlign = TextAlign.Left;
        } else {
            throw `invalid text-align '${value}'`;
        }

    }

    public setHorizontal(value) {
        this.horizontalBorder = new Border();
        this.horizontalBorder.style = BorderStyle.SolidThin;
        this.horizontalBorder.color = value;
    }

    public setVertical(value) {
        this.verticalBorder = new Border();
        this.verticalBorder.style = BorderStyle.SolidThin;
        this.verticalBorder.color = value;
    }

    static from(data) {
        let app = new Appearance();
        app.textAlign = data.textAlign;
        app.textStyle = data.textStyle;
        app.fontName = data.fontName;
        app.fontSize = data.fontSize;
        app.text = data.text;
        app.background = data.background;
        app.horizontalBorder =data.horizontalBorder && Border.from(data.horizontalBorder);
        app.verticalBorder = data.verticalBorder && Border.from(data.verticalBorder);

        return app;
    }
}