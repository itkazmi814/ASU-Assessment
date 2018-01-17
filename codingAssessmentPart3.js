const csv = require("csvtojson");

const fruitArr = ["apples", "bananas", "carrots"];
let farmsInv = {
	freddys: {
		apples: {
			inventory: 250,
			price: 1.5
		},
		bananas: {
			inventory: 100,
			price: 2
		},
		carrots: {
			inventory: 50,
			price: 3
		}
	},
	fannys: {
		apples: {
			inventory: 150,
			price: 2
		},
		bananas: {
			inventory: 150,
			price: 1
		},
		carrots: {
			inventory: 150,
			price: 3
		}
	},
	fabios: {
		apples: {
			inventory: 50,
			price: 4
		},
		bananas: {
			inventory: 50,
			price: 2
		},
		carrots: {
			inventory: 300,
			price: 2
		}
	}
};

//Takes in the csv file name from CLI to process
takeInOrdersCSVFile = () => {
	let orderCSVFilePath = "";
	process.argv.slice(2).forEach(arg => (orderCSVFilePath += arg + " "));
	orderCSVFilePath = orderCSVFilePath.trim();
	console.log(`Now processing "${orderCSVFilePath}" \n`);
	processCSVFile(orderCSVFilePath);
};

//Outputs an array of objects given a CSV file
processCSVFile = ordersInCSVFormat => {
	//Headers are renamed to accommodate for npm package formatting requirements
	csv({
		noheader: false,
		headers: [
			"Order#",
			"ApplesQty",
			"BananasQty",
			"CarrotsQty",
			"ApplesPrice",
			"BananasPrice",
			"CarrotsPrice"
		]
	})
		.fromFile(ordersInCSVFormat)
		.on("end_parsed", ordersArr => processOrders(ordersArr));
};

//Processes orders one at a time, and one fruit at a time
processOrders = ordersArr => {
	ordersArr.forEach(order => {
		const formattedOrder = formatOrder(order);
		console.log(`Order to be sent to the farms:`);
		console.log(formattedOrder);
		formattedOrder.forEach(fruitOrder => processOneFruitInOrder(fruitOrder));
	});
	console.log(`All orders fulfilled. Inventory is now:`);
	console.log(farmsInv);
};

//Reformats order object to be easier to work with
formatOrder = order => {
	const orderArr = Object.values(order);
	orderArr.shift();
	const formattedOrder = [];

	fruitArr.forEach((fruit, i) => {
		let fruitInfo = {
			name: fruit,
			qty: parseInt(orderArr[i]),
			price: parseFloat(orderArr[i + fruitArr.length].slice(1))
		};

		formattedOrder.push(fruitInfo);
	});

	return formattedOrder;
};

processOneFruitInOrder = fruitOrder => {
	console.log("ENTER processOneFruitInOrder");

	console.log(fruitOrder);

	const fruitName = fruitOrder.name;
	let orderQty = fruitOrder.qty;

	//Determines the farm to purchase the fruit from that will be the most profitable
	//NOTE on identified improvement that was not implemented due to time constraint of ~60minutes
	//Currently, if a single farm does not have all of the quantity to fulfill an order, the farm will fulfill as much as possible.
	//Improvement to be made - Find another farm to complete the order
	const farmToBuyFrom = findFarmToPurchaseFrom(fruitOrder);

	if (farmToBuyFrom === null) {
		console.log(
			"No farm was able to complete the below order, or could not do so at a profit"
		);
		console.log(fruitOrder);
	} else {
		const farmToBuyFromName = farmToBuyFrom[0];
		const farmToBuyFromQty = farmToBuyFrom[1][fruitName].inventory;
		console.log("farm we are buying from:");
		console.log(farmToBuyFrom);

		if (farmToBuyFromQty < orderQty) {
			console.log(
				`Insufficient inventory to fulfill order. Changing order qty from ${orderQty} to ${farmToBuyFromQty}`
			);
			orderQty = farmToBuyFromQty;
		}

		console.log(
			`${farmToBuyFromName} qty of ${fruitName}: ${farmToBuyFromQty}`
		);
		farmsInv[farmToBuyFromName][fruitName].inventory -= orderQty;
		console.log(
			`${farmToBuyFromName} NEW qty of ${fruitName}: ${farmsInv[
				farmToBuyFromName
			][fruitName].inventory}`
		);
	}
};

//Decides what farm, if any, to purchase from for each fruit in the order
findFarmToPurchaseFrom = fruitOrder => {
	const farmsArr = Object.entries(farmsInv);
	const buyerPrice = fruitOrder.price;
	let farmToBuyFrom = null;
	let lowestPrice = null;

	farmsArr.forEach(farm => {
		const farmName = farm[0];
		const farmInv = farm[1][fruitOrder.name];
		console.log(farmName);
		console.log(farmInv);

		console.log("farmToBuyFrom", farmToBuyFrom);

		//If no farm has been checked yet for price, this determines if the current farm is profitable at all to purchase from
		//If so, stores this farm as the farm to purchase from
		if (farmToBuyFrom === null) {
			console.log("confirmed farmToBuyFrom is null");
			let firstFoundFarm = checkForAnyProfitableFarm(farm, farmInv, buyerPrice);
			farmToBuyFrom = firstFoundFarm.farm;
			lowestPrice = firstFoundFarm.lowestPrice;
		}

		//Checks to see if the current farm in the loop is more profitable than previously chosen profitable farm
		//Will not run if farmToBuyFrom === null because lowestPrice will also be null

		if (
			farmInv.inventory > 0 &&
			buyerPrice > farmInv.price &&
			farmInv.price < lowestPrice
		) {
			console.log("found farm with lowest price");
			lowestPrice = farmInv.price;
			farmToBuyFrom = farm;
		} else {
			console.log("this is not a better deal");
		}
	});

	return farmToBuyFrom;
};

checkForAnyProfitableFarm = (farm, farmInv, buyerPrice) => {
	if (farmInv.inventory > 0 && buyerPrice > farmInv.price) {
		console.log("farmToBuyFrom is now", farm);
		return { lowestPrice: farmInv.price, farm: farm };
	}
	console.log("This farm cannot complete the order or is not profitable");
	return { lowestPrice: null, farm: null };
};

//Runs the program
takeInOrdersCSVFile();
