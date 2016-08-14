var $el = {};

function Burger() {
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
		//FIXME FIXME FIXME
		list.splice(key, 1); // Remove the item from the pool
		return item;
	};

	this.generate = function() {
		var burger = [];
		var category;
		var categories = ['cheese', 'sauces', 'toppings'];
		// To-do: Also dedupe special types
		var limits = {
			'cheese': 2,
			'sauces': 2,
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

		$.each([itemPool.cheese, itemPool.sauces, itemPool.toppings], this.prune);

		while ( true ) {
			// Which category will we be selecting from?
			category = categories[random(0, categories.length - 1)];
			if (! itemPool[category].length || ( 'on' !== settings.HardMode && 0 === limits[category])) {
				continue;
			}

			selection = this.pick(itemPool[category]);
			if (budget < selection.price ) {
				break;
			} else {
				burger.push(selection.name.toLowerCase());
				budget -= selection.price;
				limits[category]--;
			}

			// There's a 15% chance we should just quit while we're ahead
			if ( random(0,99) < 10 && 'on' !== settings.hardMode) {
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
	};
	$el.submit.click(function() {
		new Burger();
	});
});