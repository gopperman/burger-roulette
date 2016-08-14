// Helpful math functions for calculating burger possibilities
var factorial = function(n) {
  if ( 0 !== n) {
    return n * factorial(n - 1);
  } else {
    return 1;
  }
};

var random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
};

// Calculate n choose r combinations
// http://www.mathwords.com/c/combination_formula.htm
var combinations = function(n,r) {
  return factorial(n) / (factorial(r) / factorial(n-r) );
};

//Calculates the purely theoretical limits of burgerdom
var burgernatorics = function(i, j, k) {
  // Sums start at 1 because picking 0 is still a choice
  var sumI = 1, maxI = i;
  var sumJ = 1, maxJ = j; 
  var sumK = 1, maxK = k;

  //Use loops to avoid maximum call stack errors
  while(i--) {
    sumI += combinations(maxI, i);
  }
  while(j--) {
    sumJ += combinations(maxJ, j);
  }
  while(k--) {
    sumK += combinations(maxK, k);
  }
  // cheese, sauces, toppings
  return menu.burgers.length * menu.buns.length * sumI * sumJ * sumK;
}
