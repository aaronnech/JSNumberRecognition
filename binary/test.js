var fs = require('fs');
var BinaryPerceptron = require('./binaryperceptron');
var weights = require('./weights');
var Common = require('../common');
var Constants = require('../consts');

var testPerceptron = function(perceptron, inputs, labels) {
  console.log('TESTING STARTED');
  var passedExamples = 0;
  for (var i = 0; i < inputs.length; i++) {
    var isLabel = perceptron.classify(inputs[i]);
    var pass = isLabel == labels[i];
    console.log('... Example ' + i + ' perceptron says: ' + isLabel + ' Passed? ' + pass);
    if (pass) {
      passedExamples++;
    }
  }
  var percentage = 1.0 * passedExamples / labels.length;
  console.log('TESTING COMPLETE');
  console.log('Passed ' + passedExamples + ' of ' + labels.length);
  console.log('Percentage: ' + percentage);
  return {
    total : labels.length,
    passed : passedExamples,
    percentage : percentage
  }
};

var perceptrons = [];
for (var i = 0; i < Constants.TRAINED_LABELS.length; i++) {
  var percept = new BinaryPerceptron(
    Constants.DIMENSION * Constants.DIMENSION,
    Constants.LEARNING_RATE,
    Constants.THRESHOLD);
  perceptrons.push(percept);
}

fs.readFile(Constants.TESTING_FILE, 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  var parsed = Common.parseData(data);
  var inputs = parsed.inputs;
  var labels = parsed.labels;

  var results = [];

  for (var i = 0; i < perceptrons.length; i++) {
    console.log('STARTING TRAINING FOR LABEL ' + Constants.TRAINED_LABELS[i]);
    var mappedLabels = Common.mapLabels(labels, Constants.TRAINED_LABELS[i]);
    perceptrons[i].setWeights(weights[i]);
    results.push(testPerceptron(
      perceptrons[i], inputs, mappedLabels));
  }
  console.log('ALL DONE TESTING!');
  var total = 0;
  var totalPassed = 0;
  for (var i = 0; i < results.length; i++) {
    total += results[i].total;
    totalPassed += results[i].passed;
    console.log('digit: ' + i);
    console.log('Passed ' + results[i].passed + ' of ' + results[i].total);
    console.log('Percentage: ' + results[i].percentage);
  };
  console.log('TOTAL STATISTICS:');
  console.log('Passed ' + totalPassed + ' of ' + total);
  console.log('Percentage: ' + 1.0 * totalPassed / total);
});