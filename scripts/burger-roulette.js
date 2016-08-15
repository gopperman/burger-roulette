var $el = {};

function Burger() {
	// To-do: Make this function call not require .each
	this.prune = function() {
		var i = this.length;
		while (i--) {
			if ( ('omnivore' !== settings.diet && true !== this[i][settings.diet]) || budget < this[i]['price'] ) {
				this.splice(i, 1);
			}
		}
	};

	this.message = function(msg) {
		$el.results.html(msg);
	};

	// "Copies" an object instead of returning a reference to that object;
	this.copy = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	};

	this.pick = function(list) {
		var key = random(0, list.length - 1);
		var item = this.copy(list[key]);
		list.splice(key, 1); // Remove the item from the pool
		return item;
	};

	this.generate = function() {
		var burger = [];
		var category;
		var categories = ['cheese', 'sauces', 'toppings'];
		var limits = {
			'cheese': 2,
			'sauce': 2,
			'mayo': 1,
			'bbq': 1,
			'pickle': 1,
			'onion': 1,
			'toppings': -1,
		};
		var selection;

		$.each([itemPool.burgers], this.prune);

		//To-do: Calculate the number of possibilities from here

		//Pick a Burger
		if (itemPool.burgers.length) {
			selection = this.pick(itemPool.burgers);
			burger.push(selection.name.toLowerCase());
			budget -= selection.price;
		} else {
			return false;
		}

		//Pick a Bun
		$.each([itemPool.buns], this.prune);
		selection = this.pick(itemPool.buns);
		burger.push(selection.name.toLowerCase() + " bun");

		$.each([itemPool.toppings], this.prune);
toppingsLoop:
		while ( true ) {
			selection = this.pick(itemPool.toppings);
			if (budget < selection.price ) {
				break;
			} else {
				if ('on' !== settings.hardMode && selection.type) {

					// Check if we've hit our limit on these types
					for (var i = selection.type.length - 1; i >= 0; i--) {
						var type = selection.type[i];
						if (undefined !== limits[type] && 0 === limits[type]) {
							// We've hit the limit
							continue toppingsLoop;
						}
					};

				}

				burger.push(selection.name.toLowerCase());
				budget -= selection.price;

				// Update limits
				if ('on' !== settings.hardMode && selection.type) {
					for (var i = selection.type.length - 1; i >= 0; i--) {
						type = selection.type[i];
						if (undefined !== limits[type]) {
							limits[type]--;
						}
					}
				}
			}

			// There's a 15% chance we should just quit while we're ahead
			if ( random(0,99) < 15 && 'on' !== settings.hardMode) {
				break;
			}
		}
		return burger;
	};

	var settings = $el.settings.serializeObject();
	var budget = settings.budget;
	var itemPool = this.copy(menu);
	var burger = this.generate();
	if (burger) {
		this.message("Try a " + burger.join(', ') + '.');
	} else {
		this.message("Sorry, no burgers matched your parameters");
	}
}

$(document).ready(function() {
	$el = {
		'settings': $('#settings'),
		'submit': $('#generateBurger'),
		'results': $('#results'),
		'toggleSlide': $('.toggleSlide'),
		'slideOut': $('.slideOut'),
	};
	$el.submit.click(function() {
		new Burger();
	});
	$el.toggleSlide.click(function() {
		$el.slideOut.toggleClass('slideOut--open');
	});
});