const { spawn } = require("child_process");
const ISO6391 = require("iso-639-1");

function getVoiceInformation(voiceName) {
	return new Promise((res, rej) => {
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
			info.name = unparsedInfo["Name"];
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
}

module.exports = function () {
	return new Promise((res, rej) => {
		let buffers = [];
		const balcon = spawn("balcon", ["-l"]);

		balcon.stdout.on("data", (b) => buffers.push(b));
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

					const voice = await getVoiceInformation(voiceName);
					voiceList[category].push(voice);
				} else { // create categories
					const name = val.trim();
					if (name.length <= 0) continue;

					category = name;
					voiceList[name] = [];
				}
			}
			res(voiceList);
		});
	});
};
