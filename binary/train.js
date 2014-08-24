var fs = require('fs');
var BinaryPerceptron = require('./binaryperceptron');
var Constants = require('../consts');
var Common = require('../common');


var writeWeights = function(weights) {
	var file = fs.createWriteStream('./weights.js');
	file.on('error', function(err) {
		console.log('ERROR CREATING WEIGHTS FILE!')
	});
	file.write('module.exports = [');
	for (var i = 0; i < weights.length - 1; i++) {
		file.write('[');
		file.write(weights[i].join(','));
		file.write('],');
	};
	file.write('[');
	file.write(weights[weights.length - 1].join(','));
	file.write(']];');
	file.end();
};

var trainPerceptron = function(perceptron, inputs, labels) {
	console.log('TRAINING STARTED');
	perceptron.trainSet(inputs,
						labels,
						Constants.ITERATIONS,
	function(failed, setLength, i) {
		console.log(
			'.... Iteration ' + i +
			' with an input set of ' + setLength +
			' complete. Number failed? ' + failed);
	});
	console.log('TRAINING COMPLETE');
	return perceptron.getWeights();
};

var perceptrons = [];
for (var i = 0; i < Constants.TRAINED_LABELS.length; i++) {
	var percept = new BinaryPerceptron(
		Constants.DIMENSION * Constants.DIMENSION,
		Constants.LEARNING_RATE,
		Constants.THRESHOLD);
	perceptrons.push(percept);
}

fs.readFile(Constants.TRAINING_FILE, 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	var parsed = Common.parseData(data);
	var inputs = parsed.inputs;
	var labels = parsed.labels;

	var allWeights = [];
	for (var i = 0; i < perceptrons.length; i++) {
		console.log('STARTING TRAINING FOR LABEL ' + Constants.TRAINED_LABELS[i]);
		var mappedLabels = Common.mapLabels(labels, Constants.TRAINED_LABELS[i]);
		var weights = 
			trainPerceptron(perceptrons[i], inputs, mappedLabels);
		allWeights.push(weights);
	}
	writeWeights(allWeights);
});