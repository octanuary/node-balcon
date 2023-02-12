const fs = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");
const tempfile = require("./tempfile");
const ISO6391 = require("iso-639-1");

module.exports = class Balabolka {
	/**
	 * @param {{
	 *  balaPath: string,
	 *  output: string
	 * }} options
	 */
	constructor(options = {}) {
		this.options = options;

		this.balaPath = this.options.balaPath || "balcon";
		this.args = ["-w", "temp"];
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

	reset() {
		this.args = ["-w", "temp"];
		return this;
	}

	/**
	 * @param {void | string} output 
	 * @returns {Promise<Buffer | string>}
	 */
	generate(output) {
		return new Promise((res, rej) => {
			if (!this.setText) {
				return rej(new Error("no text specified"));
			}

			const filepath = (
				(output = output || "buffer")
			) == "buffer" ?
				tempfile() :
				join(module.parent.path, output);
			this.args[1] = filepath;

			let buffers = [];
			const balcon = spawn(this.balaPath, this.args);

			balcon.stdout.on("data", (c) => buffers.push(c));
			balcon.on("close", (code) => {
				if (code != 0) {
					const error = Buffer.concat(buffers).toString();
					return rej(new Error(error));
				}

				if (output == "buffer") {
					res(fs.readFileSync(filepath));
					fs.unlinkSync(filepath);
				} else {
					res(filepath);
				}
			});
		});
	}

	listVoices() {
		return new Promise((res, rej) => {
			let buffers = [];
			const balcon = spawn(this.balaPath, ["-l"]);
	
			balcon.stdout.on("data", (c) => buffers.push(c));
			balcon.stdout.on("end", async () => {
				const response = Buffer.concat(buffers).toString();
				const pieces = response.split("\r\n");
	
				let voiceList = {};
				let category;
				for (let x = 0; pieces.length > x; x++) {
					const val = pieces[x];
					if (val.startsWith("  ")) { // voices
						const voiceName = val.trim();
						if (voiceName.length <= 0) continue;
	
						const voice = await new Promise((res, rej) => {
							let buffers = [];
							const balcon = spawn("balcon", ["-n", voiceName, "-m"]);
					
							balcon.stdout.on("data", (b) => buffers.push(b));
							balcon.stdout.on("end", () => {
								const response = Buffer.concat(buffers).toString();
								const pieces = response.split("\r\n");
					
								let unparsedInfo = {};
								for (let x = 0; pieces.length - 1 > x; x++) {
									const val = pieces[x].trim().split(": ");
									unparsedInfo[val[0]] = val[1];
								}
					
								let info = {};
								info.description = unparsedInfo["Description"];
								info.vendor = unparsedInfo["Vendor"];
								info.age = unparsedInfo["Age"];
								info.gender = unparsedInfo["Gender"] == "Male" ?
									"M" : unparsedInfo["Gender"] == "Female" ?
									"F" : "U";
								info.lang = ISO6391.getCode(unparsedInfo["Language"]);
								info.channels = +unparsedInfo["Number of channels"];
								info.sampleRate = +unparsedInfo["Samples per second"];
								info.bitDepth = +unparsedInfo["Bits per sample"];
					
								res(info);
							});
						});
						voiceList[category][voiceName] = voice;
					} else { // create categories
						const name = val.trim();
						if (name.length <= 0) continue;
	
						category = name;
						voiceList[name] = {};
					}
				}
				res(voiceList);
			});
		});
	}
};
