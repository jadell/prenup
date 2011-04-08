var vows = require('vows'),
	assert = require('assert');

var Context = exports.Context = function (topic) {
	var parent = null;
	var ctx = {
		topic : topic
	};

	/**
	 * Transform into a Vows context object
	 *
	 * @return object
	 */
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

	/**
	 * Add a vow to this context
	 *
	 * @param string   title    human-readable title of the vow
	 * @param function vow      assertion function
	 * @return Context
	 */
	this.vow = function (title, vow) {
		ctx[title] = vow;
		return this;
	}

	/**
	 * Add a subcontext to this context
	 *
	 * @param string title    human-readable title of the subcontext
	 * @param mixed  topic    any valid Vows topic, or a Context object
	 * @return Context the topic context
	 */
	this.sub = function (title, topic) {
		if (!topic.seal) {
			topic = new Context(topic);
		}
		topic._parent(this);

		ctx[title] = topic;
		return topic;
	}
	
	/**
	 * Return the root ancestor of this Context
	 *
	 * @return Context
	 */
	this.root = function () {
		if (parent) {
			return parent.root();
		}
		return this;
	}
	
	/**
	 * Housekeeping for the root method
	 * Don't call this
	 *
	 * @param Context newparent    parent Context object
	 */
	this._parent = function (newparent) {
		parent = newparent;
	}
}

/*
var addition = new Context(function () { return 1+3; });
//addition.vow("is a number", function (topic) { assert.isNumber(topic); });
addition.vow("equals 4", function (topic) { assert.equal(topic, 4); });
var subtraction = addition.sub("subtract 5", function (topic) { return topic -5; });
//subtraction.vow("is a number", function (topic) { assert.isNumber(topic); });
//subtraction.vow("equals -1", function (topic) { assert.equal(topic, -1); });
var multiplication = subtraction.sub("times 2", function (topic) { return topic *2; });
multiplication.vow("is a number", function (topic) { assert.isNumber(topic); });
multiplication.vow("equals -2", function (topic) { assert.equal(topic, -2); });

var times0 = addition.sub("times 0", function (topic) { return topic *0; });
times0.vow("equals 0", function (topic) { assert.equal(topic, 0); });

var division = new Context(function () {
	return 6/2;
});
division.vow("is a number", function (topic) { assert.isNumber(topic); });
division.vow("equals 3", function (topic) { assert.equal(topic, 3); });

var flow = new Context(123)
	.vow("is a number", function (topic) {
		assert.isNumber(topic);
		})
	.vow("equals 123", function (topic) {
		assert.equal(topic, 123);
		})
	.sub("divided by 10", function (topic) {
		return topic /10;
		})
		.vow("equals 12.3", function (topic) {
			assert.equal(topic, 12.3);
			})
			.root();

vows.describe("Math Test").addBatch({
	"1 plus 3" : addition.seal(),
	"2 into 6" : division.seal(),
	"flow" : flow.seal(),
}).export(module);
*/
