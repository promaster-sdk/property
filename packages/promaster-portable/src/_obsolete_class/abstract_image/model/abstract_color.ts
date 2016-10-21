export class AbstractColor {

	a:number;
	r:number;
	g:number;
	b:number;

	static fromArgb(a:number, r:number, g:number, b:number):AbstractColor {
		return new AbstractColor(a, r, g, b);
	}

	static fromString(s:string) {
		if (s == null || s.length != 9 || s[0] != '#')
			return null;

		let a:number = parseInt(s.substring(1, 1 + 2), 16);
		let r:number = parseInt(s.substring(3, 3 + 2), 16);
		let g:number = parseInt(s.substring(5, 5 + 2), 16);
		let b:number = parseInt(s.substring(7, 7 + 2), 16);

		if (isNaN(a) || isNaN(r) || isNaN(g) || isNaN(b))
			return null;

		return this.fromArgb(a, r, g, b);
	}

	constructor(a:number, r:number, g:number, b:number) {
		this.a = a;
		this.r = r;
		this.g = g;
		this.b = b;
		Object.freeze(this);
	}

}

export abstract class AbstractColors {
	static Black:AbstractColor = AbstractColor.fromArgb(0xFF, 0, 0, 0);
	static   Blue:AbstractColor = AbstractColor.fromArgb(0xFF, 0x00, 0x00, 0xFF);
	static   Brown:AbstractColor = AbstractColor.fromArgb(0xFF, 0xA5, 0x2A, 0x2A);
	static   Cyan:AbstractColor = AbstractColor.fromArgb(0xFF, 0x00, 0xFF, 0xFF);
	static   DarkGray:AbstractColor = AbstractColor.fromArgb(0xFF, 0xA9, 0xA9, 0xA9);
	static   Gray:AbstractColor = AbstractColor.fromArgb(0xFF, 0x80, 0x80, 0x80);
	static   Green:AbstractColor = AbstractColor.fromArgb(0xFF, 0x00, 0x80, 0x00);
	static   LightGray:AbstractColor = AbstractColor.fromArgb(0xFF, 0xD3, 0xD3, 0xD3);
	static   Magenta:AbstractColor = AbstractColor.fromArgb(0xFF, 0xFF, 0x00, 0xFF);
	static   Orange:AbstractColor = AbstractColor.fromArgb(0xFF, 0xFF, 0xA5, 0x00);
	static   Purple:AbstractColor = AbstractColor.fromArgb(0xFF, 0x80, 0x00, 0x80);
	static   Red:AbstractColor = AbstractColor.fromArgb(0xFF, 0xFF, 0x00, 0x00);
	static   Transparent:AbstractColor = AbstractColor.fromArgb(0x00, 0xFF, 0xFF, 0xFF);
	static   White:AbstractColor = AbstractColor.fromArgb(0xFF, 0xFF, 0xFF, 0xFF);
	static   Yellow:AbstractColor = AbstractColor.fromArgb(0xFF, 0xFF, 0xFF, 0x00);
	static   LightBlue:AbstractColor = AbstractColor.fromArgb(0xFF, 0xAD, 0xD8, 0xE6);
}


