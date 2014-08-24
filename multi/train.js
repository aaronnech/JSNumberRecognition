var fs = require('fs');
var MultiPerceptron = require('./multiperceptron');
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

var percept = new MultiPerceptron(
		Constants.DIMENSION * Constants.DIMENSION,
		Constants.TRAINED_LABELS.length,
		Constants.LEARNING_RATE);

fs.readFile(Constants.TRAINING_FILE, 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	var parsed = Common.parseData(data);
	var inputs = parsed.inputs;
	var labels = parsed.labels;

	var mappedLabels = Common.mapLabelsToDigits(labels);
	var weights = 
		trainPerceptron(percept, inputs, mappedLabels);
	writeWeights(weights);
});