dimsum
======

![Build Status](https://secure.travis-ci.org/ninjascribble/dimsum.png)

Dimsum generates greek text, and outputs it as plain text or HTML. You can use it on the client, or in your Node.js projects. 

## Usage

```js
var dimsum = require('dimsum');

dimsum.generate();
// => 'Impedit ex ex veniam doloribus possimus quod...'

dimsum.generate(3);
// => Returns 3 paragraphs of dimsum text.

dimsum.configure({ format: 'html' });
// => Configure dimsum to return HTML instead of plain text.

dimsum.generate(2, { format: 'text' });
// => Or override the configuration just this once.
```

## API

Dimsum contains a minimal API for controlling the amount of text it generates.

```js
// Unformatted sentences and paragraphs
dimsum.sentence();
dimsum.paragraph();

// Pre-composed blocks of text
dimsum.classic();
dimsum.cicero32();
dimsum.cicero33();
```

