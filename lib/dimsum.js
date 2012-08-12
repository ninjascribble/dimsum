var dimsum = global.dimsum = {};

var punct = [',','.',';',':','?'];
	punct.regexp = new RegExp('[' + punct.join('') + ']*','g');

var grammar = {
	sentences_per_paragraph: [3,5],
	questions_per_paragraph: [0,2],
	words_per_sentence: [10,31],
	commas_per_sentence: [0,4]
};

var classic = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

var cicero_1_10_32 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

var cicero_1_10_33 = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

dimsum.latin = dedupe( normify([classic, cicero_1_10_32, cicero_1_10_33]).split(' ') );

dimsum.classic = function() { return classic; };

dimsum.cicero32 = function() { return cicero_1_10_32; };

dimsum.cicero33 = function() { return cicero_1_10_33; };

dimsum.sentence = function() {

	var word = '';
	var words = [];
	var num_words = range(grammar.words_per_sentence[0], grammar.words_per_sentence[1]);
	var num_commas = range(grammar.commas_per_sentence[0], grammar.commas_per_sentence[1]);

	// Get some words
	while (words.length < num_words) {
		word = dimsum.latin[ range(0, dimsum.latin.length -1) ];
		words.push(word);
	}

	// Add some commas
	for (var i = 0; i < num_commas; i++) {
		word = range(4, words.length - 3);
		if (words[word].match(',')) {
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

dimsum.paragraph = function() {
	var sentences = [];
	var num_sentences = range(grammar.sentences_per_paragraph[0], grammar.sentences_per_paragraph[1]);
	while (sentences.length < num_sentences) {
		sentences.push(this.sentence());
	}
	return sentences.join(' ');
};

/**
 * Create a random chunk of lipsum. Returns an array containing
 * the number of paragraphs specified.
 *
 * @param num_paragraphs How many paragraphs to generate.
 */
dimsum.generate = function(num_paragraphs) {
	var sentences = [];
	var paragraphs = [];
	num_paragraphs = num_paragraphs || 1;
	while (paragraphs.length < num_paragraphs) {
		paragraphs.push(this.paragraph());
	}
	return paragraphs.join("\r\n\r\n");
};

/** Utils **/
function normify(strings) {
	return strings.join(' ')
			.toLowerCase()
			.replace(punct.regexp, '');
};

function dedupe(array) {
	var obj = {};
	var result = [];
	for (var i = 0; i < array.length; i++) {
		obj[array[i]] = null;
	}
	for (key in obj) {
		result.push(key);
	}
	return result;
}

function range(min, max) {
	return min + Math.random() * (max - min - 1) << 0;
}