# Dimsum

Dimsum generates lorem ipsum text. You can use it in your Node.js and web projects.

![Build Status](https://secure.travis-ci.org/ninjascribble/dimsum.png)

### Installation

With [npm](https://npmjs.org), just run:
```bash
npm install dimsum@0.1
```

Or grab the source from [GitHub](https://github.com/ninjascribble/dimsum), and pull it into your own project.

### Dimsum in two lines

```js
var dimsum = require('dimsum');
dimsum(); // => 'Impedit ex veniam doloribus possimus quod laudantium...'
```

You can configure Dimsum to return HTML, too:

```js
dimsum.configure({ format: 'html' });
dimsum(); // => '<p>Reiciendis fugit fuga ut placeat officiis nostrud...'
```

You can tell Dimsum exactly how much text you want:

```js
dimsum(3);
```

### In-browser replacement

Dimsum can also inject lorem ipsum into your static HTML! Just include the library and add tokens to your HTML:

```html
<script src="/js/dimsum.js"></script>
<article>{{dimsum}}</article>
```

Dimsum will replace the token with one paragraph of HTML-formatted lorem ipsum. If you want more, just ask:

```html
<article>{{dimsum:p3}}</article>
```

### Flavors

Dimsum contains classic "latin" and "jabberwocky" flavors. Switching between them is easy:

```js
dimsum.configure({ flavor: 'jabberwocky' });
dimsum() // => 'Frabjous snicker-snack to son brillig, took vorpal...'
```

You can even add your own flavors. Larger blocks of text work best:

```js
dimsum.flavor('outerspace', 'This is not science fiction. This is a sober \
, realistic presentation prepared by leading scientists. I have found this \
statement so informative and interesting that I wish to share it with all the \
people of America, and indeed with all the people of the earth. I hope that it \
can be widely disseminated by all news media for it clarifies many aspects of \
space and space technology in a way which can be helpful to all people as the \
United States proceeds with its peaceful program in space science and exploration. \
Every person has the opportunity to share through understanding in the adventures \
which lie ahead.');

dimsum.configure({ flavor: 'outerspace' });
dimsum() // => Science clarifies every to realistic for news...
```

### API

**JavaScript:**
```js
// One unformatted paragraph of lorem ipsum
dimsum();

// Three unformatted paragraphs of lorem ipsum
dimsum(3);

// Three HTML-formatted paragraphs of lorem ipsum
dimsum(3, { format: 'html' });

// Two unformatted sentences of lorem ipsum
dimsum.sentence(2);

// Always use HTML
dimsum.configure({ format: 'html' });

// Always use Jabberwocky
dimsum.configure({ flavor: 'jabberwocky' });

// Get a list of available flavors
dimsum.flavors();

// Add a new flavor
dimsum.flavor( 'key', 'a large body of text' );
```

**HTML:**
```html
<!-- Replace with one paragraph of lorem ipsum -->
<div>{{dimsum}}</div>

<!-- Replace with three paragraphs of lorem ipsum -->
<div>{{dimsum:p3}}</div>

<!-- Replace with four sentences of lorem ipsum -->
<span>{{dimsum:s4}}</div>
```

### Misc

Dimsum is licensed under the [MIT License](http://opensource.org/licenses/MIT). Feel free to use it however you like.

Issues or feature requests? https://github.com/ninjascribble/dimsum/issues
