var dimsum, assert;

if (typeof require == 'undefined') {
    dimsum = dimsum;
    assert = chai.assert;
}
else {  
    dimsum = require('../dimsum');
    assert = require('assert');
}

describe('dimsum', function() {

    beforeEach(function() {
        dimsum.initialize();
    });

    it('wraps the #generate() method', function() {
        assert.ok(dimsum().match(/^[A-Z][A-Za-z.,\s]*.$/));
    });

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

        var d, i, o;

        it('always returns dimsum', function() {
            d = dimsum.configure({ 'format': 'text' });
            assert.equal(d, dimsum);
        });

        it('outputs plain text by default', function() {
            o = dimsum.generate(3);
            assert.equal(o.match(/<p>|<\/p>/g), null);
            assert.equal(o.match(/\r\n\r\n/g).length, 2);
        });

        it('can output HTML text too!', function() {
            dimsum.configure({ 'format': 'html' });
            o = dimsum.generate(3);
            assert.equal(o.match(/<p>/g).length, 3);
            assert.equal(o.match(/<\/p>/g).length, 3);
            assert.equal(o.match(/\r\n\r\n/g), null);
        });

        it('can adjust the number of sentences in a paragraph', function() {
            dimsum.configure({ 
                sentences_per_paragraph: [2,2]
            });
            for (i = 0; i < 100; i++) {
                assert.strictEqual(dimsum.paragraph().match(/[\.]{1,1}/g).length, 2);
            }
        });

        it('can adjust the number of words per sentence', function() {
            dimsum.configure({ 
                words_per_sentence: [1,1]
            });
            for (i = 0; i < 100; i++) {
                assert.strictEqual(dimsum.sentence().split(' ').length, 1);
            }
        });

        it('can adjust the number of commas per sentence', function() {
            dimsum.configure({
                commas_per_sentence: [1,1]
            });
            for (i = 0; i < 100; i++) {
                assert.strictEqual(dimsum.sentence().match(/\,/g).length, 1);
            }
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

    describe('#flavors()', function() {

        var result;

        it('Returns a list of strings', function() {
            result = dimsum.flavors();
            assert.ok(result instanceof Array);
            assert.equal(typeof result[0], 'string');
        });

        it('Contains "latin" and "jabberwocky" by default', function() {
            result = dimsum.flavors();
            assert.equal(result.length, 2);
            assert.equal(result[0], 'latin');
            assert.equal(result[1], 'jabberwocky');
        });

    });

    describe('#flavor()', function() {

        it('Returns an existing flavor when given a key', function() {

            var classic = normify( [dimsum.classic()] ).split(' ')
              , result = dimsum.flavor('latin')
              , i = 0
              , len = classic.length;

            for (i; i < len; i++) {
                assert.ok(result.indexOf( classic[i] ) > -1);
            }

        });

        it('Returns a new flavor when given a string', function() {

            var ingredients = "Space, the final frontier. These are the voyages of the starship Enterprise. Her five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before."
              , flavor = dimsum.flavor(ingredients)
              , i = 0
              , len = flavor.length;

            for (i; i < len; i++) {
                assert.ok(ingredients.match( new RegExp(flavor[i], 'i') ));
            }

        });

        it('Registers a new flavor when given a key and a string', function() {

            var key = 'spock'
              , ingredients = "Space, the final frontier. These are the voyages of the starship Enterprise. Her five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before."
              , flavor = dimsum.flavor(key, ingredients)
              , result = dimsum.flavor(key)
              , i = 0
              , len = flavor.length;

            for (i; i < len; i++) {
                assert.ok(result.indexOf( flavor[i] ) > -1);
            }

        });

    });

    describe('#parse()', function() {

        var result;

        it('Replaces {\\{dimsum}} with some text', function() {
            result = dimsum.parse('Hello, {{dimsum}}');
            assert.ok( result.match('Hello, ') );
            assert.ok( result.replace('Hello, ', '').match(/[a-z]{5}/) );
            assert.ok( !result.match(/\r\n\r\n/g) );
            assert.ok( !result.match(/<\/p><p>/g) );
        });

        it('Replaces {\\{dimsum}} AND {\\{dimsum}} with exactly two paragraphs of text', function() {
            result = dimsum.parse('{{dimsum}} AND {{dimsum}}').split('AND');
            assert.ok( result[0].match(/[a-z]{5}/) );
            assert.ok( !result[0].match(/\r\n\r\n/g) );
            assert.ok( !result[0].match(/<\/p><p>/g) );
            assert.ok( result[1].match(/[a-z]{5}/) );
            assert.ok( !result[1].match(/\r\n\r\n/g) );
            assert.ok( !result[1].match(/<\/p><p>/g) );
        });

        it('Replaces {\\{dimsum:p2}} with exactly two paragraphs of text', function() {
            result = dimsum.parse('Hello, {{dimsum:p2}}');
            assert.ok( result.match('Hello, ') );
            assert.ok( result.replace('Hello, ', '').match(/[a-z]{5}/) );
            assert.equal(result.match(/\r\n\r\n/g).length, 1);
        });

        it('Replaces {\\{dimsum:s3}} with exactly three sentences of text', function() {
            result = dimsum.parse('Hello, {{dimsum:s3}}');
            assert.ok( result.match('Hello, ') );
            assert.ok( result.replace('Hello, ', '').match(/[a-z]{5}/) );
            assert.equal(result.match(/\./g).length, 3);
        });

    });

    /* Utils */

    var punct = [',','.',';',':','?','!']
      , punct_reg = new RegExp('[' + punct.join('') + ']*','g');

    function normify(strings) {
        return strings.join(' ')
                .toLowerCase()
                .replace(punct_reg, '');
    };

});