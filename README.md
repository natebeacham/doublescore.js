# doublescore.js

***

## Preface

This library serves as an JavaScript adaptation of the itertools and functools built-in libraries of the Python language.

## The iterator

__.iterator will return a Python iterator inspired object. Looping through them can be done via the following:

	var iterator = __.iterator(0, function(c) { return c + 1; }, function(c) { return c > 3; });

	while ((c = iterator.next()) != __.stop) {
		console.log(c);
	}

***

## "Itertools" - Tools for Iteration

Most of these functions can be found within Python's itertools documentation. They will be reiterated here for the sake of minor discrepencies and convienience.

#### __.chain(*iterables)

#### __.combinations(iterable, num)

#### __.compress(iterator, selectors)

#### __.count(start, step)

#### __.cycle(iterable)

#### __.dropwhile(predicate, iterable)

#### __.idropwhile(predicate, iterable)

#### __.ifilter(predicate, iterable)

#### __.ifilterfalse(predicate, iterable)

#### __.groupby(iterable. key)

#### __.imap(callable, *iterables)

#### __.nth(iterable, index, default)

#### __.permuatations(iterable, num)

#### __.product(*iterables, repeat)

#### __.repeat(entity, times)

#### __.islice(iterable. start=0, stop=iterable.length, stop=1)

#### __.starmap(callable, iterable)

#### __.takewhile(predicate, iterable)

#### __.itakewhile(predicate, iterable)

#### __.tee(predicate, iterable)

#### __.zip(one, two)

#### __.izip(one, two)

***

## "Functools" - Tools for Functional Development

#### __.partial(function, arguments)

Curries a function. Currying is to create a new function signature with the original function arguments prefilled with `arguments`. ie:

	var add = function(a, b) { return a + b; }
	var addToTwo = __.partial(add, 2);
	addToTwo(3); // 5

#### __.curry(function, arguments)
Alias for __.partial().

#### __.reduce(function, sequence, initializer)

See Python's reduce()

***

## Extra & Goodies

#### __.truthy(entity)
Creates a true boolean from an entity (ie: __nonzero__)

#### __.iterable(entity)
Creates a sequence from an entity. ie:

	__.iterable([1, 2, 3]); // [1, 2, 3]
	__.iterable('ABCD'); // ['A', 'B', 'C', 'D']
	__.iterable(1); // [1]

#### __.range(min, max)
Constructs a range.

#### __.reverse(iterable)
Reverses the order of an iterator. ie:

	__.reverse([1, 2, 3]); // [3, 2, 1]

#### __.set(iterable)
Returns a `set` an sequence of unique elements.

	__.set([1, 1, 2, 3, 3]); // [3, 2, 1]

#### __.smallest(iterables)
Returns the iterable from iterables with the smallest length.

#### __.largest(iterables)
Like __.smallest(), but returns the largest iterable.

***

## Playing with Other Libraries

#### underscore.js

	if (_ && _.mixin) {
		_.mixin(__);
	}

#### jQuery
	
	if ($ && $.extend) {
		$.extend($, __);
	}
