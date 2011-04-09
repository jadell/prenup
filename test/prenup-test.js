var vows = require('vows'),
	assert = require('assert'),
	prenup = require('../lib/index'),
	Context = prenup.Context;

// Simple math example
var addition = new Context(function () { return 1+3; })
	.vow("is a number", function (topic) { assert.isNumber(topic); })
	.vow("equals 4", function (topic) { assert.equal(topic, 4); })
	.sub("subtract 5", function (topic) { return topic -5; })
		.vow("is a number", function (topic) { assert.isNumber(topic); })
		.vow("equals -1", function (topic) { assert.equal(topic, -1); })
		.sub("times 2", function (topic) { return topic *2; })
			.vow("is a number", function (topic) { assert.isNumber(topic); })
			.vow("equals -2", function (topic) { assert.equal(topic, -2); })
			.parent()
		.sub("times 0", function (topic) { return topic *0; })
			.vow("equals 0", function (topic) { assert.equal(topic, 0); })
			.root();

// A new chain next to the "addition" chain
var division = prenup.createContext(function () {
	return 6/2;
})
	.vow("is a number", function (topic) { assert.isNumber(topic); })
	.vow("equals 3", function (topic) { assert.equal(topic, 3); });

// Fluent interface
var flow = new Context(123)
	.vow("is a number", function (topic) { assert.isNumber(topic); })
	.vow("equals 123", function (topic) { assert.equal(topic, 123); })
	.sub("divided by 10", function (topic) { return topic /10; })
		.vow("equals 12.3", function (topic) { assert.equal(topic, 12.3); })
		.root();

vows.describe("Arithmetic Test").addBatch({
	"1 plus 3" : addition.seal(),
	"2 into 6" : division.seal(),
	"123" : flow.seal(),
}).export(module);

