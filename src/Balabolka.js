const fs = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");
const tempfile = require("./tempfile");

module.exports = class Balabolka {
	constructor(options = {}) {
		this.options = options;

		this.filepath = this.options.output == "buffer" ?
			tempfile() :
			join(module.parent.parent.path, this.options.output);
		this.args = ["-w", this.filepath];
		this.setText = false;
	}

	set(...args) {
		this.args.push(...args);
		return this;
	}

	voice(voice) {
		this.args.push("-n", voice);
		return this;
	}

	text(text) {
		this.setText = true;
		this.args.push("-t", text);
		return this;
	}

	generate() {
		return new Promise((res, rej) => {
			if (!this.setText) rej(new Error("no text specified"));

			let buffers = [];
			const balcon = spawn("balcon", this.args);

			balcon.stdout.on("data", (c) => buffers.push(c));

			balcon.on("close", (code) => {
				if (code != 0) {
					const error = Buffer.concat(buffers).toString();
					return rej(new Error(error));
				}

				res(
					this.options.output == "buffer" ?
						fs.readFileSync(this.filepath) :
						this.filepath
				);
			});
		});
	}
};
