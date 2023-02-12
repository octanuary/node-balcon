const { listVoices } = require("./index.js");

listVoices().then((voices) => {
	console.log(voices);
	/*
	'SAPI 5:': [
		{
			name: 'Cepstral Whispery',
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
