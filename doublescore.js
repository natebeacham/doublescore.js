/************************************************************
 * doublescore.js
 * Python itertools/functools inspired functions in JavaScript
 * nate beacham, 2011
 * http://natebeacham.com
 * License: MIT
 * Version: 0.1
 ***********************************************************/
(function() {
	var __version = '0.1'
	
	if (typeof __ != 'undefined' && __.version == __version) {
		return;
	}
	
	__ = {};
	
	__.version = __.VERSION = __version;
	
	
	/****************
	 * Helpers 
	 ***************/
	
	__.each = function(array, callable) {
		if (Array.prototype.forEach) {
			array.forEach(callable);
		}

		for (var i = 0; i < array.length; i++) {
			callable.call(array[i]);
		}
	};
	
	__.truthy = function(entity) {
		if (typeof entity == 'object') {
			for (var i in entity) {
				if (entity.hasOwnProperty(i)) {
					return true;
				}
			}
		}
		return !!entity; 
	};
	
	__.iterable = function(entity) {
		//Ensures that an entity is iterable
		
		if ((Array.prototype.isArray && Array.prototype.isArray(entitiy)) ||
			(Object.prototype.toString.call(entity) == '[object Array]')) {
				return entity;
		}
		
		if (typeof entity == 'string') {
			result = [];
			
			for (var i = 0; i < entitiy.length; i++) {
				result.push(entitiy[i]);
			}
			
			return result;
		}
		
		return [entity];
	};
	
	/****************
	 * Functions 
	 ***************/
	
	__.fromkeys = function(keys, __default) {
		var result = {};

		forEach(keys, function(key) {
			result[key] = __default;
		});
		
		return result;
	};
	
	/****************
	 * Objects 
	 ***************/
	
	__.stop = {}; // Token to represent exhausted iterator
	__.emptyIterator = {next: function(){ return __.stop }};
	__.iterator = function(start, pattern, conclusion) {
		/*
		 * Constructs an iterator.
		 * 
		 * Example usage:
			var it = __.iterator(0, function(c) {return c+1;}, function(c) {return c > 3;});
			
			while ((c = it.next()) != __.stop) {
				console.log(c);
			};
		 */
		conclusion = conclusion || function() { return false; }
		
		var iter = {};
		var current = start;
		var initialized = false;
		var stopped = false;
		
		iter.next = function() {
			if (stopped) {
				return __.stop;
			}
			
			if (!initialized) {
				initialized = true;
				return current;
			}

			current = pattern(current);

			if (conclusion(current)) {
				stopped = true;
			}
			
			return current;
		}
		
		return iter;
	};
	
	/****************
	 * Itertools 
	 ***************/
	
	__.chain = function() {
		var iters = arguments, result = [];
		
		for (var i = 0; i < iters.length; i++) {
			result = result.concat(__.iterable(iters[i]));
		}
		
		return result;
	};
	
	__.combinations = function(iterable, num) {
		
	};
	
	__.compress = function(data, selectors) {
		var zipped = __.zip(__.iterable(data), __.iterable(selectors));
		var result = [];
		
		for (var i = 0; i < zipped.length; i++) {
			if (__.truthy(selectors[i])) {
				result.push(data[i]);
			}
		}
		
		return result;
	};
	
	__.count = function(start, step) {
		start = start || 0;
		step = step || 1;
		
		return __.iterator(start, function(c) { return c + step;})
	};
	
	__.cycle = function(iterable) {
		var iter = __.iterable(iterable);
		
		if (!iter) {
			return __.emptyIterator;
		}
		
		var index = 0;

		var iterator = __.iterator(iter[0], function(c) {
			index++;
			if (typeof iter[index] != 'undefined') {
				return iter[index];
			}
			index = 0;
			return iter[0];
		}); 
		
		return iterator;
	};
	
	__.dropwhile = function(predicate, iterable) {
		var i = 0;
		var iter = __.iterable(iterable);
		
		for (; i < iter.length; i++) {
			if (!predicate(iter[i])) {
				break;
			}
		}
		
		var result = [];
		
		for (; i < iter.length; i++) {
			result.push(iter[i]);
		}
		
		return result;
	};
	
	__.groupby = function(iterable, key) {
	
	};
	
	__.ifilter = function(predicate, iterable) {
		var iter = __.iterable(iterable);

		predicate = predicate || __.truthy;
		
		if (!iter) {
			return {next: function(){ return __.stop }};
		}
		
		for (var i = 0; i < iter.length; i++) {
			if (predicate(iter[i])) {
				break;
			}
		}
		
		if (typeof iter[i] == 'undefined') {
			return __.emptyIterator;
		}
		
		return __.iterator(iter[i], function(c) {
			for (; i < iter.length; ++i) {
				if (predicate(iter[i])) {
					break;
				}
			}
			return iter[i];
		}, function(c) {
			return typeof c == 'undefined';
		})
	};
	
	__.ifilterfalse = function(predicate, iterable) {
		
	};
	
	__.imap = function() {
		var predicate = arguments[0];
	}
	
	__.islice = function() {
		
	};
	
	__.izip = function() {
		
	};
	
	__.nth = function(iterable, index, __default) {
		return (index >= 0 && index < iterable.length) ? iterable[index] : __default;
	}
	
	__.permutations = function(iterable, num) {
		
	};
	
	__.product = function() {
		
	};

	__.repeat = function(entity, times) {
		if (typeof times == 'undefined') {
			return __.iterator(entity, function() { return entity; });
		}
		
		var count = 0;
		return __.iterator(entity, function() { return entity; }, function() {
			count++;
			return count > times;
		});
	};
	
	__.starmap = function(iterable, callable) {
		
	};
	
	__.takewhile = function(predicate, iterable) {
		
	};
	
	__.tee = function(iterable, num) {
		num = num || 2;
	};
	
	__.zip = function(one, two) {
		var result = [];
		
		if (one.length != two.length) {
			throw new Error('Arrays are not the same length in call to __.zip');
		}
		
		for (var i = 0; i < one.length; i++) {
			result.push([one[i], two[i]]);
		}
		
		return result;
	};
	
	/****************
	 * Functools 
	 ***************/
	
	__.reduce = function (callable, iterable, initializer) {
		
	};
	
})();