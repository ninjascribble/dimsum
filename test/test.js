var dimsum = require('../dimsum'),
	assert = require('assert');

describe('dimsum', function() {

	describe('#sentence()', function() {

		var c, i, s = [];

		for (i = 0; i < 100; i++) {
			s.push( dimsum.sentence() );
		}

		it('should start with a capital letter', function() {
			for (i in s) {
				c = s[i][0];
				assert.equal(c, c.toUpperCase());	
			}
		});

		it('should end with a period', function() {
			for (i in s) {
				c = s[i][ s[i].length - 1 ];
				assert.equal(c, '.');	
			}
		});

		it('should never contain two or more punctuation characters in a row', function() {
			for (i in s) {
				assert.strictEqual(s[i].match(/[\.,]{2,}/g), null);
			}
		});

	});

	describe('#configure()', function() {

		var p, d;

		it('outputs plain text by default', function() {
			p = dimsum.generate(3);
			assert.equal(p.match(/<p>|<\/p>/g), null);
			assert.equal(p.match(/\r\n\r\n/g).length, 2);
		});

		it('can output HTML text too!', function() {
			dimsum.configure({ 'format': 'html' });
			p = dimsum.generate(3);
			assert.equal(p.match(/<p>/g).length, 3);
			assert.equal(p.match(/<\/p>/g).length, 3);
			assert.equal(p.match(/\r\n\r\n/g), null);
		});

		it('always returns dimsum', function() {
			d = dimsum.configure({ 'format': 'text' });
			assert.equal(d, dimsum);
		});

	});

	describe('#generate()', function() {

		var p;

		it('provides one paragraph of text by default', function() {
			p = dimsum.generate();
			assert.equal(p.match(/<p>|<\/p>/g), null);
			assert.equal(p.match(/\r\n\r\n/g), null);
		});

		it('can override preconfigured options', function() {
			dimsum.configure({ 'format': 'html' });
			p = dimsum.generate(3, { 'format': 'text' });
			assert.equal(p.match(/<p>|<\/p>/g), null);
			assert.equal(p.match(/\r\n\r\n/g).length, 2);
			p = dimsum.generate(3);
			assert.equal(p.match(/<p>/g).length, 3);
			assert.equal(p.match(/<\/p>/g).length, 3);
			assert.equal(p.match(/\r\n\r\n/g), null);
		});

	});

});