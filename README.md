# Dimsum

*Dimsum generates lorem ipsum text. You can use it on the client, or in your Node.js projects.*

![Build Status](https://secure.travis-ci.org/ninjascribble/dimsum.png)

    npm install dimsum@0.1

### Quick start

```js
var dimsum = require('dimsum');

dimsum();
// => 'Impedit ex veniam doloribus possimus quod laudantium...'

dimsum(3);
// => Returns 3 formatted paragraphs of text

dimsum.configure({ format: 'html' });
// => Configure dimsum to return HTML instead of plain text
```

### API

```js
// Generate paragraphs of text
dimsum([num_paragraphs, options]);

// Configure dimsum for subsequent use
dimsum.configure(options);

// Create unformatted sentences and paragraphs
dimsum.sentence();
dimsum.paragraph();

// Create pre-composed blocks of Lorem Ipsum
dimsum.classic();
dimsum.cicero32();
dimsum.cicero33();
```

### TODO

* Support for "flavors" of text (e.g. Jabberwocky, Shakespeare, etc...)
* Automatic client-side replacement
