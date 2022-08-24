# node-balcon
i don't feel like writing this

## Requirements
 - Windows
 - Node 16.7.0+
 - Balabolka command line in the PATH variable

## Installation
npm:
```
npm install node-balcon
```

## Usage
Save to a buffer:
```js
const { Balabolka } = require("../index.js");

const bala = new Balabolka({
	output: "buffer"
})
	.voice("Microsoft David Desktop")
	.text("you are so grounded grounded");

bala.generate().then((buffer) => {
	console.log(buffer); // <Buffer 52 49 46 46 26 31 01 00 57 41 56 45 66 6d 74 ... >
}).catch((err) => console.log(err));
```

Save to a file:
```js
const { Balabolka } = require("../index.js");

const bala = new Balabolka({
	output: "./voice.wav"
})
	.voice("Microsoft David Desktop")
	.text("you are so grounded grounded");

bala.generate().then((filepath) => {
	console.log(filepath); // C:\...
}).catch((err) => console.log(err));
```
