const inquirer = require("inquirer");

class Product {
	constructor(name, price) {
		this.name = name;
		this.price = price;
	}
}

const apple = new Product("apple", 2);
const banana = new Product("banana", 1.5);
const carrot = new Product("carrot", 3);

getOrder = () => {
	const questions = [
		{
			name: "appleQty",
			type: "input",
			message: "How many apples would you like to order? (Integer)"
		},
		{
			name: "bananaQty",
			type: "input",
			message: "How many bananas would you like to order? (Integer)"
		},
		{
			name: "carrotQty",
			type: "input",
			message: "How many carrots would you like to order? (Integer)"
		}
	];

	inquirer.prompt(questions).then(answer => {
		console.log(
			`You ordered ${answer.appleQty} apples, ${answer.bananaQty} bananas, and ${answer.carrotQty} carrots`
		);

		if (answer.carrotQty % 3 !== 0) {
			answer.carrotQty = validateCarrotQty(parseInt(answer.carrotQty));
			console.log(
				`Carrots must be ordered in multiples of three. Your order has been adjusted to include ${answer.carrotQty} carrots`
			);
		}

		console.log(`Your total order cost is $${getOrderCost(answer)}`);
	});
};

getOrderCost = order => {
	const appleCost = apple.price * order.appleQty;
	const bananaCost = banana.price * order.bananaQty;
	const carrotCost = carrot.price * order.carrotQty;
	return appleCost + bananaCost + carrotCost;
};

validateCarrotQty = carrotQty => {
	return carrotQty + 3 - carrotQty % 3;
};

getOrder();
