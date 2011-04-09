/**
 * Wrap a Vows context and provide some useful methods for extending it.
 *
 * @param mixed  topic    any valid Vows topic, or a Context object
 */
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
		topic.parent(this);

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
	 * Get or set-get the current context's parent
	 *
	 * @param Context newparent    parent Context object
	 * @return Context
	 */
	this.parent = function (newparent) {
		if (!!newparent) {
			parent = newparent;
		}
		return parent;
	}
}

exports.createContext = function (topic) {
	return new Context(topic);
}

