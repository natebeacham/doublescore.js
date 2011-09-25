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
			
			for (var i = 0; i < entity.length; i++) {
				result.push(entity[i]);
			}
			
			return result;
		}
		
		return [entity];
	};
	
	__.range = function(min, max) {
		var result = [];
		
		for (var i = min; i < max; i++) {
			result.push(i);
		}
		
		return result;
	};
	
	__.reverse = function(iterable) {
		var result = [];
		
		for (var i = iterable.length - 1; i >= 0; i--) {
			result.push(iterable[i]);
		}
		
		return result;
	};

	__.set = function(iterable) {
		var iter = __.iterable(iterable);
		var result = [];
		var flag;

		for (var i = 0; i < iter.length; i++) {
			flag = true;
			for (var j = 0; j < result.length; j++) {
				if (iter[i] == result[j]) {
					flag = false;
					break;
				}
			}
			if (flag) {
				result.push(iter[i]);
			}
		}
		
		return result;
	};
	
	__.smallest = function() {
		var result = arguments[0];
		
		for (var i = 1 ; i < arguments.length; i++) {
			if (arguments[i].length < result.length) {
				result = arguments[i];
			}
		}
		
		return result;
	};
	
	__.largest = function() {
		var result = arguments[0];
		
		for (var i = 1 ; i < arguments.length; i++) {
			if (arguments[i].length > result.length) {
				result = arguments[i];
			}
		}
		
		return result;
	};
	
	/****************
	 * Objects 
	 ***************/
	
	__.stop = {}; // Token to represent exhausted iterator
	__.emptyIterator = {next: function(){ return __.stop }};
	__.iterator = function(start, pattern, satisfied) {
		/*
		 * Constructs an iterator.
		 * 
		 * Example usage:
			var it = __.iterator(0, function(c) {return c+1;}, function(c) {return c > 3;});
			
			while ((c = it.next()) != __.stop) {
				console.log(c);
			};
		 */
		satisfied = satisfied || function() { return false; }
		
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

			if (satisfied(current)) {
				stopped = true;
				return __.stop;
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

		// FIXME!

		var iter = __.iterable(iterable);
		var len = iter.length;
		
		if (num > len) {
			return __.emptyIterator;
		}
		
		var indices = __.range(0, num);
		var start = [];
		
		for (var i = 0; i < indices.length; i++) {
			start.push(iter[i]);
		}
		
		return __.iterator(start, function(c) {
			var reversed = __.reverse(indices);
			
			for (var i = 0; i < reversed.length; i++) {
				if (indices[reversed[i]] != reversed[i] + len - num) {
					break;
				}
			}
			
			indices[reversed[i]] += 1;
			
			var range = __.range(reversed[i] + 1, num);
			
			for (var j = 0; j < range.length; j++) {
				indices[range[j]] = indices[range[j]-1] + 1;
			}
			
			var result = [];
		
			for (var k = 0; k < indices.length; k++) {
				result.push(iter[indices[k]]);
			}
			
			return result;
			
		}, function(c) {
			var reversed = __.reverse(__.range(0, num));
			
			for (var i = 0; i < reversed.length; i++) {
				if (indices[reversed[i]] != reversed[i] + len - num) {
					return false;
				}
			}

			return true;
		});
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
		
		return __.iterator(start, function(c) { return c + step; })
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
			if (!predicate.apply(iter[i])) {
				break;
			}
		}
		
		var result = [];
		
		for (; i < iter.length; i++) {
			result.push(iter[i]);
		}
		
		return result;
	};
	
	__.idropwhile = function(predicate, iterable) {
		var i = 0;
		var iter = __.iterable(iterable);
		
		for (; i < iter.length; i++) {
			if (!predicate.apply(iter[i])) {
				break;
			}
		}
		
		if (i == iter.length) {
			return __.emptyIterator;
		}
		
		return __.iterator(iter[i], function() {
			i++;
			return iter[i];
		}, function() {
			return i > iter.length;
		});
	};
	
	__.groupby = function(iterable, key) {
	
	};
	
	__.ifilter = function(predicate, iterable) {
		var iter = __.iterable(iterable);

		predicate = predicate || __.truthy;
		
		if (!iter) {
			return __.emptyIterator;
		}
		
		var i = 0;
		
		for (; i < iter.length; i++) {
			if (predicate.apply(iter[i])) {
				break;
			}
		}
		
		if (typeof iter[i] == 'undefined') {
			return __.emptyIterator;
		}
		
		return __.iterator(iter[i], function(c) {
			i++;
			for (; i < iter.length; i++) {
				if (predicate.apply(iter[i])) {
					break;
				}
			}
			return iter[i];
		}, function(c) {
			return typeof c == 'undefined';
		});
	};
	
	__.ifilterfalse = function(predicate, iterable) {
		var iter = __.iterable(iterable);

		predicate = predicate || __.truthy;
		
		if (!iter) {
			return __.emptyIterator;
		}
		
		for (var i = 0; i < iter.length; i++) {
			if (!predicate.apply(iter[i])) {
				break;
			}
		}
		
		if (typeof iter[i] == 'undefined') {
			return __.emptyIterator;
		}
		
		return __.iterator(iter[i], function(c) {
			i++;
			for (; i < iter.length; i++) {
				if (!predicate.apply(iter[i])) {
					break;
				}
			}
			return iter[i];
		}, function(c) {
			return typeof c == 'undefined';
		});
	};
	
	__.imap = function() {
		var func = arguments[0];
		var iterables = Array.prototype.slice.apply(arguments, [1]);
		var index = 0;
		var bound = __.smallest(iterables).length;

		var compute = function() {
			var args = [];
			
			for (var i = 0; i < iterables.length; i++) {
				args.push(iterables[i][index]);
			}
			
			return func.apply(null, args);
		};
		
		return __.iterator(compute(), function() {
			index++;
			return compute();
		}, function() {
			return index > bound;
		});
		
	}
	
	__.islice = function(iterable, start, stop, step) {
		var iter = __.iterable(iterable);

		start = start || 0;
		stop = stop || iterable.length;
		step = step || 1;

		return __.iterator(iterable[start], function() {
			start += step;
			return iter[start];
		}, function() {
			return start >= stop;
		});
	};
	
	__.izip = function(one, two) {
		var result = [];
		
		if (one.length != two.length) {
			throw new Error('Arrays are not the same length in call to __.zip');
		}
		
		var index = 0;
		
		return __.iterator([one[index], two[index]], function() {
			index++;
			return [one[index], two[index]];
		}, function(c) {
			return typeof c[0] == 'undefined' || typeof c[1] == 'undefined'; 
		});
	};
	
	__.nth = function(iterable, index, __default) {
		var iter = __.iterable(iterable);
		return (index >= 0 && index < iter.length) ? iter[index] : __default;
	}
	
	__.permutations = function(iterable, num) {
		var result = [];
		var iter = __.iterable(iterable);
		var length = iter.length; 
		
		if (typeof num == 'undefined') {
			num = length;
		}
		
		var product = __.product(__.range(0, length), num);

		for (var i = 0; i < product.length; i++) {
			if (__.set(product[i]).length == num) {
				var x = [];
				for (var j = 0; j < product[i].length; j++) {
					x.push(iter[product[i][j]]);
				}
				result.push(x);
			}
		}
		
		return result;
	};
	
	__.product = function() {
		var caboose = Array.prototype.slice.apply(arguments, [arguments.length-1])[0];

		if (isNaN(caboose)) {
			var iterables = [];

			for (var i = 0; i < arguments.length; i++) {
				iterables.push(__.iterable(arguments[i]));
			}
		}
		else {
			var iterables = [];
			var args = Array.prototype.slice.apply(arguments, [0, arguments.length-1]);
			
			for (var c = 0; c < caboose; c++) {
				for (var i = 0; i < args.length; i++) {
					iterables.push(__.iterable(args[i]));
				}
			}
		}
		
		var result = [[]];
		
		for (var i = 0; i < iterables.length; i++) {
			var tmp = [];
			for (var x = 0; x < result.length; x++) {
				for (var y = 0; y < iterables[i].length; y++) {
					tmp.push(result[x].concat([iterables[i][y]]));
				}	
			}
			result = tmp;
		}
		
		return result;
	};

	__.repeat = function(entity, times) {
		if (typeof times == 'undefined') {
			return __.iterator(entity, function() { return entity; });
		}
		
		var count = 0;
		
		return __.iterator(entity, function() { return entity; }, function() {
			count++;
			return count >= times;
		});
	};
	
	__.starmap = function(callable, iterable) {
		var result = [];
		var iter = __.iterable(iterable);
		
		for (var i = 0; i < iter.length; i++) {
			result.push(callable.apply(null, __.iterable(iter[i])));
		}
		
		return result;
	};
	
	__.takewhile = function(predicate, iterable) {
		var iter = __.iterable(iterable);
		var result = [];
		
		for (var i = 0; i < iter.length; i++) {
			if (predicate.apply(iter[i])) {
				result.push(iter[i]);
			}
			else {
				break;
			}
		}
		
		return result;
	};
	
	__.itakewhile = function(predicate, iterable) {
		var iter = __.iterable(iterable);

		if (!iter) {
			return __.emptyIterator;
		}
		
		var index = 0;
		
		return __.iter(iter[index], function(c) {
			index++;
			return iter[index]
		}, function(c) {
			return !predicate.apply(c);
		});
	};
	
	__.tee = function(iterable, num) {
		num = num || 2;
		
		var result = [];
		var iter = __.iterable(iterable);
		
		for (var i = 0; i < num; i++) {
			var newIter = function() {
				var index = 0;
				return __.iterator(iterable[0], function() {
					index++;
					return iterable[index];
				}, function(c) {
					return typeof c == 'undefined';
				})
			};
			result.push(newIter());
		}
		
		return result;
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
	
	__.partial = __.curry = function(func) {
		var args = Array.prototype.slice.apply(arguments, [1]);
		
		var curried = function() {
			return func.apply(null, args.concat(Array.prototype.slice.apply(arguments)));
		};
		
		curried.func = func; 
		curried.args = args;
		
		return curried;
	};
	
	__.reduce = function (callable, iterable, initializer) {
		if (typeof initializer == 'undefined') {
			var sequence = __.iterable(iterable);
		}
		else {
			var sequence = [initializer].concat(__.iterable(iterable));
		}
		
		var reduced = sequence[0];
		
		if (sequence.length == 1) {
			return reduced;
		}
		
		for (var i = 1; i < sequence.length; i++) {
			reduced = callable.apply(null, [reduced, sequence[i]])
		}
		
		return reduced;
	};
})();