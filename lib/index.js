var vows = require('vows'),
	assert = require('assert');

var Context = function (topic) {
	var ctx = {
		topic : topic
	};

	this.seal = function () {
		var sealed = {};

		for (i in ctx) {
			if (ctx[i].seal) {
				sealed[i] = ctx[i].seal();
			} else {
				sealed[i] = ctx[i];
			}
		}
		return sealed;
	};

	this.vow = function (title, vow) {
		ctx[title] = vow;
	}

	this.sub = function (title, topic) {
		if (!topic.seal) {
			topic = new Context(topic);
		}
		ctx[title] = topic;
		return topic;
	}
}


var addition = new Context(function () { return 1+3; });
//addition.vow("is a number", function (topic) { assert.isNumber(topic); });
addition.vow("equals 4", function (topic) { assert.equal(topic, 4); });
var subtraction = addition.sub("subtract 5", function (topic) { return topic -5; });
//subtraction.vow("is a number", function (topic) { assert.isNumber(topic); });
//subtraction.vow("equals -1", function (topic) { assert.equal(topic, -1); });
var multiplication = subtraction.sub("times 2", function (topic) { return topic *2; });
multiplication.vow("is a number", function (topic) { assert.isNumber(topic); });
multiplication.vow("equals -2", function (topic) { assert.equal(topic, -2); });


var division = new Context(function () {
	return 6/2;
});
division.vow("is a number", function (topic) { assert.isNumber(topic); });
division.vow("equals 3", function (topic) { assert.equal(topic, 3); });


vows.describe("Math Test").addBatch({
	"1 plus 3" : addition.seal(),
	"2 into 6" : division.seal()
}).export(module);
