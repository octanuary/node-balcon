# node-balcon
i don't feel like writing this

## Requirements
 - Windows
 - Node 16.7.0+
 - Balcon in the PATH variable or a path to Balcon

## Installation
npm:
```
npm install node-balcon
```

## Usage
Save to a buffer:
```js
const { Balabolka } = require("./index.js");

const bala = new Balabolka()
	.voice("Microsoft David Desktop")
	.text("you are so grounded grounded");

bala.generate().then((buffer) => {
	console.log(buffer); // <Buffer 52 49 46 46 26 31 01 00 57 41 56 45 66 6d 74 ... >
}).catch((err) => console.error(err));
```

Save to a file:
```js
const { Balabolka } = require("./index.js");

const bala = new Balabolka()
	.voice("Microsoft David Desktop")
	.text("you are so grounded grounded");

bala.generate("./voice.wav").then((filepath) => {
	console.log(filepath); // C:\...
}).catch((err) => console.error(err));
```

### Voice listing
```js
const { listVoices } = require("./index.js");

listVoices().then((voices) => {
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
}).catch((err) => console.error(err));
```
