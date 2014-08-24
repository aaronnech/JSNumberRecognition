module.exports.parseData = function(data) {
	console.log('PARSING FILE');
	var inputs = [];
	var labels = [];
	var lines = data.split('\n');
	console.log('.... ' + lines.length + ' lines');
	for (var line = 0; line < lines.length - 1; line++) {
		var entries = lines[line].split(',');
		var label = entries.shift();
		var input = entries.map(function (x) {
			return parseInt(x) / 255.0;
		});
		inputs.push(input);
		labels.push(label);
	}
	console.log(
		'.... parsed ' + inputs.length +
		' inputs and ' + labels.length + ' labels');
	console.log('.... first example (verfication): ');
	console.log('.... label: ' + labels[0]);
	console.log('.... input (length ' + inputs[0].length + '): ' + inputs[0]);


	console.log('PARSING COMPLETE');
	return {
		labels : labels,
		inputs : inputs
	};
};

module.exports.mapLabels = function(labels, trainedLabel) {
	console.log('Mapping labels to booleans for label ' + trainedLabel);
	var result = labels.map(function(label) {
		return label == trainedLabel;
	});
	return result;
};

module.exports.mapLabelsToDigits = function(labels) {
	console.log('Mapping labels to integers');
	var result = labels.map(function(label) {
		return parseInt(label);
	});
	return result;
};