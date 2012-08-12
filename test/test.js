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

});