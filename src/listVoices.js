const { spawn } = require("child_process");

module.exports = function () {
	return new Promise((res, rej) => {
		let buffers = [];
		const balcon = spawn("balcon", ["-l"]);

		balcon.stdout.on("data", (b) => buffers.push(b));
		balcon.stdout.on("end", () => {
			const response = Buffer.concat(buffers).toString();
			const pieces = response.split("\r\n");

			let voiceList = {};
			let category;
			for (let x = 0; pieces.length > x; x++) {
				const val = pieces[x];
				if (val.startsWith("  ")) { // voices
					const voice = val.trim();
					if (voice.length <= 0) continue;

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
