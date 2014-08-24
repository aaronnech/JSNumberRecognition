var fs = require('fs');
var MultiPerceptron = require('./multiperceptron');
var weights = require('./weights');
var Common = require('../common');
var Constants = require('../consts');

var testPerceptron = function(perceptron, inputs, labels) {
  console.log('TESTING STARTED');
  var passedExamples = 0;
  for (var i = 0; i < inputs.length; i++) {
    var pickedLabel = perceptron.classify(inputs[i]);
    var pass = pickedLabel == labels[i];
    console.log('... Example ' + i + ' perceptron says: ' + pickedLabel + ' Passed? ' + pass);
    if (pass) {
      passedExamples++;
    }
  }
  var percentage = 1.0 * passedExamples / labels.length;
  console.log('TESTING COMPLETE');
  console.log('Passed ' + passedExamples + ' of ' + labels.length);
  console.log('Percentage: ' + percentage);
};

var percept = new MultiPerceptron(
    Constants.DIMENSION * Constants.DIMENSION,
    Constants.TRAINED_LABELS.length,
    Constants.LEARNING_RATE);

fs.readFile(Constants.TESTING_FILE, 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  var parsed = Common.parseData(data);
  var inputs = parsed.inputs;
  var labels = parsed.labels;

  var results = [];

  var mappedLabels = Common.mapLabelsToDigits(labels);
  percept.setWeights(weights);
  testPerceptron(
    percept, inputs, mappedLabels);
  console.log('ALL DONE TESTING!');
});