export class RenderedImage {

  private _format:string;
  private _output:any;

  constructor(format, output) {
    this._format = format;
    this._output = output;
    Object.freeze(this);
  }

	get format():string {
		return this._format;
	}

	get output():any {
		return this._output;
	}

}

