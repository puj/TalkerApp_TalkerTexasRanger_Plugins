/*
 *  The Talker Texas Ranger bot has the ability to connect to multiple rooms.
 *
 *  This plugin is designed to provide simple math functionality in the Talker Texas Ranger Bot
 */

var talker = require('../lib/talker');


talker.command('math', function (data, args) {	
	// Combine the arguments
	var formula = args.join();

	try{
		// Validate the formula
		MathEngine.validate(formula);
		
		// Solve the problem
		var answer = MathEngine.solve(formula);

	}catch (e){
		if(typeof e === "string"){ 
			// This is one of our error message
			talker.message(data.room,e);		
		}else{
			// This is a syntax/semantic error
			talker.log(e);
		}
		return;
	}

	// Send answer
	talker.message(data.room, formula + " = " + answer);
});


var MathEngine = {
	operators : [],
	operationMap : []
};

MathEngine.registerOperator = function(operator, fn){
	// An array of operators to iterae though
	this.operators.push(operator);

	// A map from operator to function to carry out logic
	this.operationMap[operator] = fn;
	
};

MathEngine.validate = function (formula){
	// Remove whitespace just in case
	formula = formula.replace(/\s/g, "");

	// Modify test string to only get numbers
	var testString = formula;

	// Remove all symbols from test string
	var pattern = new RegExp("[\\" + this.operators.join("\\") + "]","g");
	testString = testString.replace(pattern,"");

	// If test string is now only numbers, we are good
	if(!(/^[0-9]+$/.test(testString))){
		throw "Invalid math expression.";			
	}
	
	return true;
};

MathEngine.evaluate = function(operand,operatorIndex){
	// Get the current operator
	var operator = this.operators[operatorIndex];

	// Check it the operator is in the operand
	var indexInString = operand.indexOf(operator);

	// This operatorIndex doesn't need to be evaluated
	if(indexInString === -1){
		if(operatorIndex === this.operators.length-1){
			// This is the last operator to evaluate, this is a number
			return parseFloat(operand);
		}else{
			// Need to check the other operators
			return this.evaluate(operand,operatorIndex+1);
		}
	}

	// Left side of operator
	var leftOperand = operand.slice(0,indexInString);	
	if(leftOperand === ''){throw "Operators cannot be adjacent/Expression cannot start with operator"}

	// Right side of operator
	var rightOperand = operand.slice(indexInString+1);
	if(rightOperand === ''){throw "Operators cannot be adjacent/Expression cannot end with operator"}

	// Apply the appropriate operation to the operands
	return this.operationMap[operator].apply(this,[leftOperand,rightOperand,operatorIndex]);
};

MathEngine.solve = function(formula){	
	// Evaluate the formula starting with the most precedent operator
	return this.evaluate(formula,0);
};

/*
 * Register all operators and their math operations
 *  TODO: Simplifiy this with a proxy or something.
 * This is ascending order of precedence.
 */
MathEngine.registerOperator('-', function(operandOne, operandTwo, operatorIndex){
	return this.evaluate(operandOne,operatorIndex) - this.evaluate(operandTwo,operatorIndex);
});
MathEngine.registerOperator('+', function(operandOne, operandTwo, operatorIndex){
	return this.evaluate(operandOne,operatorIndex) + this.evaluate(operandTwo,operatorIndex);
});
MathEngine.registerOperator('*', function(operandOne, operandTwo, operatorIndex){
	return this.evaluate(operandOne,operatorIndex) * this.evaluate(operandTwo,operatorIndex);
});
MathEngine.registerOperator('/', function(operandOne, operandTwo, operatorIndex){
	return this.evaluate(operandOne,operatorIndex) / this.evaluate(operandTwo,operatorIndex);
});
MathEngine.registerOperator('\\', function(operandOne, operandTwo, operatorIndex){
	return this.evaluate(operandOne,operatorIndex) / this.evaluate(operandTwo,operatorIndex);
});


