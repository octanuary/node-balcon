const Balabolka = require("./index.js");
const balcon = new Balabolka({
	balaPath: "C:\\PATH\\balcon\\balcon.exe"
});

balcon.listVoices().then((voices) => {
	console.log(voices);
	/*
	{
		'SAPI 5:': {
			'Cepstral Whispery': {
				description: 'Cepstral Whispery',
				vendor: 'Cepstral',
				age: '30',
				gender: 'U',
				lang: 'en',
				channels: 1,
				sampleRate: 16000,
				bitDepth: 16
			},
	*/
});

balcon
	.voice("Microsoft David Desktop")
	.text("You are so grounded grounded for 5089503 years")
	.generate("./test.wav").then(() => console.log("done generating"));
