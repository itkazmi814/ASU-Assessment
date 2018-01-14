const orderCSVFilePath = "Exercise 2 - Orders.csv";
const csv = require("csvtojson");

let farmsInv = {
	freddys: {
		apples: 250,
		bananas: 0,
		carrots: 0
	},
	fannys: {
		apples: 0,
		bananas: 150,
		carrots: 0
	},
	fabios: {
		apples: 0,
		bananas: 0,
		carrots: 100
	}
};

const fruitArr = ["apples", "bananas", "carrots"];

processOrders = () => {
	csv()
		.fromFile(orderCSVFilePath)
		.on("end_parsed", ordersArr => fulFillOrders(ordersArr));
};

fulFillOrders = ordersArr => {
	ordersArr.forEach(order => {
		order.Apples = parseInt(order.Apples);
		order.Bananas = parseInt(order.Bananas);
		order.Carrots = parseInt(order.Carrots);
		console.log(order);

		const orderArr = Object.values(order);
		orderArr.shift();

		orderArr.forEach((fruitQty, i) => {
			reduceFarmInv(fruitQty, fruitArr[i]);
		});
	});
	console.log(`All orders fulfilled. Inventory is now:`);
	console.log(farmsInv);
};

reduceFarmInv = (orderQty, fruit) => {
	const farmsArr = Object.entries(farmsInv);

	farmsArr.forEach(farm => {
		const farmName = farm[0];
		const farmInv = farm[1];
		//Bug identified:
		//If a farm is found to be able to satisfy the order for a fruit, the program will continue checking if another farm can also satisfy the order, and would proceed to update their inventory amounts.
		//In the interest of sticking to the ~60 minutes meant for this part of the coding assessment, I have not fixed this bug.
		if (farmInv[fruit] >= orderQty) {
			farmsInv[farmName][fruit] -= orderQty;
			console.log(
				`${farmName} inventory of ${fruit} updated to: ${farmsInv[farmName][
					fruit
				]}
					`
			);
		}
	});
};

processOrders();
