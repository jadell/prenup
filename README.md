Prenup
======
Author: Josh Adell <josh.adell@gmail.com>  
Copyright (c) 2011  

Syntactic sugar for Vows

API
---

    createContext(topic) : Context
Create a new Context object.  `topic` is a valid Vows topic.

    Context::vow(title, vow) : Context
Add a vow assertion to the context.  Returns the Context object. `title` is the string Vows will display in --spec output.  `vow` is a valid Vows assertion function.

    Context::sub(title, topic) : Context
Create a subcontext.  Returns the subcontext as a Context object. `title` is the string Vows will display in --spec output.  `topic` is a valid Vows topic.

    Context::parent() : Context
    Context::parent(parent) : Context
Return the Context object's parent context or `null` if the Context has no parent.  If `parent` is provided, set it as the parent context and return it.

    Context::root() : Context
Return most distant ancestor of the Context object, the root of the context tree.

    Context::seal() : object
Return a context tree in the proper form to be used as a Vows test.


Example
-------

Suppose we have the following Vows test:

    var vows = require('vows'),
        assert = require('assert');
    
    vows.describe("Arithmetic Test").addBatch({
        "2 into 6" : {
            topic : function () { return 6/2; },
            "is a number" : function (topic) { assert.isNumber(topic); },
            "equals 3" : function (topic) { assert.equal(topic, 3); }
        },

        "123" : {
            topic : 123,
            "is a number" : function (topic) { assert.isNumber(topic); },
            "equals 123" : function (topic) { assert.equal(topic, 123); },
            "divided by 10" : {
                topic : function (topic) { return topic/10; },
                "equals 12.3" : function (topic) { assert.equal(topic, 12.3); }
            }
        },

        "1 plus 3" : {
            topic : function () { return 1 + 3; },
            "is a number" : function (topic) { assert.isNumber(topic); },
            "equals 4" : function (topic) { assert.equal(topic, 4); },
            "subtract 5" : {
                topic : function (topic) { return topic -5; },
                "is a number" : function (topic) { assert.isNumber(topic); },
                "equals -1" : function (topic) { assert.equal(topic, -1); },
                "times 2" : {
                    topic : function (topic) { return topic *2; },
                    "is a number" : function (topic) { assert.isNumber(topic); },
                    "equals -2" : function (topic) { assert.equal(topic, -2); }
                },
                "times 0" : {
                    topic : function (topic) { return topic *0; },
                    "equals 0" : function (topic) { assert.equal(topic, 0); }
                }
            }
        }
    }).export(module);

As tests contain more steps and branches, they become more difficult to read.  It also become difficult to tell at-a-glance which pieces of the test are assertions (vows) and which are test steps (subcontexts).

We can make the first test easier by using a Prenup `Context`:

    var Context = require('prenup').Context;
    
    var divisionTest = new Context(function () { return 6/2; })
	    .vow("is a number", function (topic) { assert.isNumber(topic); })
	    .vow("equals 3", function (topic) { assert.equal(topic, 3); });

    vows.describe("Arithmetic Test").addBatch({
        "2 into 6" : divisionTest.seal()
    }).export(module);

Prenup exposes a fluent interface for easily adding test steps.  Here is the second test, with multiple steps, rewritten with Prenup:

    var fluentTest = new Context(123)
        .vow("is a number", function (topic) { assert.isNumber(topic); })
        .vow("equals 123", function (topic) { assert.equal(topic, 123); })
        .sub("divided by 10", function (topic) { return topic /10; })
            .vow("equals 12.3", function (topic) { assert.equal(topic, 12.3); })
            .root();

    vows.describe("Arithmetic Test").addBatch({
        "2 into 6" : divisionTest.seal(),
        "123" : fluentTest.seal()
    }).export(module);

The final test has several branches (which in Vows will be run in parallel).  Test branches can be added by popping up the test chain to the parent subcontext.  Here is the third test:

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
    
    vows.describe("Arithmetic Test").addBatch({
        "2 into 6" : divisionTest.seal(),
        "123" : fluentTest.seal(),
        "1 plus 3" : additionTest.seal()
    }).export(module);


