/*!
 * dimsum.js v0.1
 * https://github.com/ninjascribble/dimsum
 * MIT licensed
 * 
 * Copyright (C) 2012 Scott Grogan, http://ninjascript.com
 */
;(function(global) {

var classic = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

cicero_1_10_32 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",

cicero_1_10_33 = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",

jabberwocky = "'Twas brillig, and the slithy toves Did gyre and gimble in the wabe; All mimsy were the borogoves, And the mome raths outgrabe. Beware the Jabberwock, my son! The jaws that bite, the claws that catch! Beware the Jubjub bird, and shun The frumious Bandersnatch! He took his vorpal sword in hand: Long time the manxome foe he sought So rested he by the Tumtum tree, And stood awhile in thought. And as in uffish thought he stood, The Jabberwock, with eyes of flame, Came whiffling through the tulgey wood, And burbled as it came! One, two! One, two! and through and through The vorpal blade went snicker-snack! He left it dead, and with its head He went galumphing back. And hast thou slain the Jabberwock? Come to my arms, my beamish boy! O frabjous day! Callooh! Callay! He chortled in his joy. 'Twas brillig, and the slithy toves Did gyre and gimble in the wabe; All mimsy were the borogoves, And the mome raths outgrabe.",

defaults = {
    'format': 'text',
    'flavor': 'latin',
    'sentences_per_paragraph': [3, 5],
    'words_per_sentence': [10, 31],
    'commas_per_sentence': [0, 4]
},

config = {},

punct = [',','.',';',':','?','!','"','—','\r','\n'],

punct_reg = new RegExp('[' + punct.join('') + ']*','g'),

flavors = {
    'latin': dedupe( normify([classic, cicero_1_10_32, cicero_1_10_33]).split(' ') ),
    'jabberwocky': dedupe( normify([jabberwocky]).split(' ') )
},

dimsum = global.dimsum = exports = function(num_paragraphs, options) {
    return dimsum.generate(num_paragraphs, options);
};

// For client-side compatibility
if (typeof module !== 'undefined') module.exports = dimsum;

/**
 * The standard Lorem Ipsum passage.
 */
dimsum.classic = function() {
    return classic;
};

/**
 * Section 1.10.32 of Cicero's "de Finibus Bonorum et Malorum".
 */
dimsum.cicero32 = function() {
    return cicero_1_10_32;
};

/**
 * Section 1.10.33 of Cicero's "de Finibus Bonorum et Malorum".
 */
dimsum.cicero33 = function() {
    return cicero_1_10_33;
};

/**
 * Restore default configuration.
 */
dimsum.initialize = function() {
    return this.configure(defaults);
};

/**
 * Override the current configuration.
 *
 * @param options
 *      An object containing new config values.
 */
dimsum.configure = function(options) {
    config = shallow_copy(config, options);
    return this;
};

/**
 * @return A list of flavors that are currently available.
 */
dimsum.flavors = function() {
    return Object.keys(flavors);
};

/**
 * Creates a flavor out of the ingredients.
 *
 * @return An array containing the words used in this flavor.
 */
dimsum.flavor = function(name, ingredients) {

    if (arguments.length == 0) {
        return;
    }
    else if (arguments.length == 1) {
        
        if (name.match(/\s/)) {
            return dedupe( normify([name]).split(' ') );
        }
        else {
            return flavors[name];
        }
    }
    else {
        flavors[name] = (typeof ingredients == 'Array') ? ingredients : dedupe( normify([ingredients]).split(' ') );
        return flavors[name];
    }
};

/**
 * Create a random chunk of lipsum. Returns a string containing
 * the number of paragraphs specified.
 *
 * @param num_paragraphs
 *      How many paragraphs to generate.
 *
 * @param options
 *      An object containing new config values. The new options
 *      will only apply to this one execution.
 */
dimsum.generate = function(num_paragraphs, options) {

    var config_1 = config,
        sentences = [],
        paragraphs = [],
        result = '',
        num_paragraphs = num_paragraphs || 1;

    // Shift args if only an options arg is passed
    if (typeof num_paragraphs == 'object') {
        options = num_paragraphs;
        num_paragraphs = 1;
    }

    // Temporarily overwrite the configuration
    this.configure(options);

    // Add some paragraphs
    while (paragraphs.length < num_paragraphs) {
        paragraphs.push(this.paragraph());
    }

    // Make it pretty
    switch(config.format) {
        case 'text':
            result = paragraphs.join("\r\n\r\n");
            break;
        case 'html':
            result = '<p>' + paragraphs.join('</p><p>') + '</p>';
            break;
    }

    // Restore the original configuration
    config = config_1;

    return result;
};

/**
 * Create a single sentence of random lipsum.
 */
dimsum.sentence = function() {

    var word = '',
        words = [],
        num_words = range(config.words_per_sentence[0], config.words_per_sentence[1]),
        num_commas = range(config.commas_per_sentence[0], config.commas_per_sentence[1]),
        flavor = flavors[config.flavor];

    // Get some words
    while (words.length < num_words) {
        word = flavor[ range(0, flavor.length -1) ];
        words.push(word);
    }

    // Add some commas
    for (var i = 0; i < num_commas; i++) {
        word = range(4, words.length - 3);
        if (!words[word]) {
            break;
        }
        else if (words[word].match(',')) {
            i--;
        }
        else {
            words[word] += ',';
        }
    }

    // Capitalize the first word
    words = words.join(' ');
    words = words.replace(/^[a-z]/i, words[0].toUpperCase());

    // Punctuate and return
    return words + '.';
};

/**
 * Create a single paragraph of random lipsum.
 */
dimsum.paragraph = function() {

    var sentences = [],
        num_sentences = range(config.sentences_per_paragraph[0], config.sentences_per_paragraph[1]);

    while (sentences.length < num_sentences) {
        sentences.push(this.sentence());
    }
    return sentences.join(' ');
};

/**
 * Replace any ocurrences of {{dimsum}} with generated text.
 */
dimsum.parse = function(root) {

    var reg = /{{dimsum[:]?([pst0-9]*)}}/ig,
        root = root || document.getElementsByTagName('body')[0],
        command = '';

    // If root is just a string, then return a string with replacement
    if (typeof root == 'string') {
        return root.replace(reg, function(m, sm) {
            return make_dimsum(sm, 'text');
        });
    }

    // If it's a TextNode, then make sure it matches and replace it with some markup
    else if (root.nodeType == 3 && root.data.match(reg)) {

        var div = document.createElement('div');

        div.className = 'dimsum';
        div.innerHTML = root.data.replace(reg, function(m, sm) {
            return make_dimsum(sm, 'html');
        });

        root.parentNode.insertBefore(div, root);
        root.parentNode.removeChild(root);
    }

    // If it's not a TextNode, then keep on walking the DOM
    else {
        for (var i = 0, len = root.childNodes.length; i < len; i++) {
            dimsum.parse(root.childNodes[i]);
        }
    }
};

dimsum.initialize();

if ('document' in this) {
    this.document.addEventListener('DOMContentLoaded', function() {
        dimsum.parse(document.getElementsByTagName('body')[0]);
    });
}

/** Utils **/
function normify(strings) {
    return strings.join(' ')
            .toLowerCase()
            .replace(punct_reg, function(match) {
                if (match.match(/\r|\n/)) {
                    return ' ';
                }
                else {
                    return '';
                }
            });
};

function dedupe(array) {

    var obj = {},
        result = [];

    for (var i = 0; i < array.length; i++) {
        obj[array[i]] = null;
    }
    for (key in obj) {
        result.push(key);
    }
    return result;
};

function range(min, max) {
    return min + Math.random() * (max - min) << 0;
};

function shallow_copy() {

    var i, key, result = {},
        args = Array.prototype.slice.call(arguments);

    for (i = 0; i < args.length; i++) {
        for (key in args[i]) {
            result[key] = args[i][key];
        }
    }
    return result;
};

function make_dimsum(shorthand, format) {
    
    var shorthand = shorthand || '',
        format = format || 'text',
        type = shorthand[0] || 'p',
        len = parseInt( shorthand.slice(1, shorthand.length) ) || 1,
        i = 0,
        result = [];

    switch (type) {

        case 'p':
            result.push(dimsum(len, { format: format }));
            break;

        case 's':
            for (i; i < len; i++) {
                result.push(dimsum.sentence());
            }
            if (format == 'html') {
                result.unshift('<p>');
                result.push('</p>');
            }
            break;

        default:
            break;
    }

    return result.join(' ');
};

/* Debug */
// dimsum.normify = normify;
// dimsum.dedupe = dedupe;
// dimsum.range = range;
// dimsum.shallow_copy = shallow_copy;

}(this));