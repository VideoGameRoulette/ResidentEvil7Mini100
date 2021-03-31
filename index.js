const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 500;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

var json;

var InventoryCount;
var PlayerInventory;
var PreviousMap = "";
var CurrentMap = "";
var enemyHP = [];
var isStarted = false;
var isEnded = false;

function InitBosses() {
	while (enemyHP.length)
	{
		enemyHP.pop();
	}
	enemyHP.push({ isAlive: true, name: "MIA1", easy: 700, normal: 0, madhouse: 700 });
	enemyHP.push({ isAlive: true, name: "MIA2", easy: 2000, normal: 0, madhouse: 2300 });
	enemyHP.push({ isAlive: true, name: "JACK1", easy: 10000, normal: 0, madhouse: 10000 });
	enemyHP.push({ isAlive: true, name: "JACK2", easy: 4500, normal: 0, madhouse: 4500 });
	enemyHP.push({ isAlive: true, name: "JACK3", easy: 30000, normal: 0, madhouse: 30000 });
	enemyHP.push({ isAlive: true, name: "MARG1", easy: 1500, normal: 0, madhouse: 1500 });
	enemyHP.push({ isAlive: true, name: "MARG2", easy: 15000, normal: 0, madhouse: 15000 });
	enemyHP.push({ isAlive: true, name: "EVE", easy: 6000, normal: 0, madhouse: 6000 });
	enemyHP.push({ isAlive: true, name: "FATM", easy: 10000, normal: 0, madhouse: 10000 });
	enemyHP.push({ isAlive: true, name: "FATM2", easy: 0, normal: 0, madhouse: 15000 });
}

window.onload = function () {
	InitBosses()
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function MapChaged(_MapName) {
	if (_MapName != CurrentMap)
	{
		PreviousMap = CurrentMap;
		CurrentMap = _MapName;
		console.log(`Map Changed... Prev: ${PreviousMap} Curr: ${CurrentMap}`);
	}
}

function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	MapChaged(data.MapName);

	if (CurrentMap.includes("뇐")) 
	{
		isStarted = false;
	}

	if (CurrentMap.includes("Ship3FInfirmaryPast") && !CurrentMap.includes("뇐") && !isStarted)
	{
		isStarted = true;
		isEnded = false;
		console.log("New Run Started Reseting Boss Values...");
		InitBosses();
		console.log(enemyHP);
	}

	if (PreviousMap.includes("irs01A_Action") && CurrentMap.includes("None") && isStarted && !isEnded)
	{
		isStarted = false;
		isEnded = true;
		console.log("Run Finished Reseting Boss Values...");
		console.log(enemyHP);
	}

	var deadEnemies = data.EnemyHealth.filter(e => {return !e.IsAlive || (e.MaximumHP == 10000)});

	deadEnemies.map(enemy => {
		if (CurrentMap.includes("Storeroom01") && enemy.MaximumHP == enemyHP[0].easy && enemyHP[0].isAlive) {
			enemyHP[0].isAlive = false;
			console.log("Mia 1 Defeated...");
			console.log(enemyHP);
		}
		if (CurrentMap.includes("3F") && enemy.MaximumHP == enemyHP[1].easy  && enemyHP[1].isAlive || CurrentMap.includes("3F") && enemy.MaximumHP == enemyHP[1].hard && enemyHP[1].isAlive) {
			enemyHP[1].isAlive = false;
			console.log("Mia 2 Defeated...");
			console.log(enemyHP);
		}
		if (PreviousMap.includes("MainHouse1FGarage") && CurrentMap.includes("MainHouse1FGarageHallway") && enemy.MaximumHP == enemyHP[2].easy && enemyHP[2].isAlive) {
			enemyHP[2].isAlive = false;
			console.log("Jack 1 Defeated...");
			console.log(enemyHP);
		}
		if (CurrentMap.includes("RightAreaB1FFreezer") && enemy.MaximumHP == enemyHP[3].easy && enemyHP[3].isAlive) {
			enemyHP[3].isAlive = false;
			console.log("Jack 2 Defeated...");
			console.log(enemyHP);
		}
		if (CurrentMap.includes("OldHouse") && enemy.MaximumHP == enemyHP[5].easy && enemyHP[5].isAlive) {
			enemyHP[5].isAlive = false;
			console.log("Margurite 1 Defeated...");
			console.log(enemyHP);
		}
		if (CurrentMap.includes("GH1F") && enemy.MaximumHP == enemyHP[6].easy && enemyHP[6].isAlive || CurrentMap.includes("GH2F") && enemy.MaximumHP == enemyHP[6].easy && enemyHP[6].isAlive) {
			enemyHP[6].isAlive = false;
			console.log("Margurite 2 Defeated...");
			console.log(enemyHP);
		}
	});
	
	//Fine
	if (data.CurrentHP <= 1500 && data.CurrentHP >= 601) {
		mainContainer.innerHTML += `
		<div class="tag">
			<i class="fas fa-heartbeat"></i>
		</div>
		<div id="value"><font size="4" color="#7cfc00">${data.CurrentHP}</font></div>`;
	}	
	
	//Caution!
	else if (data.CurrentHP <= 600 && data.CurrentHP >= 301) {
		mainContainer.innerHTML += `
		<div class="tag">
			<i class="fas fa-heartbeat"></i>
		</div>
		<div id="value"><font size="4" color="#daa520">${data.CurrentHP}</font></div>`;
	}
	
	//Dangerops!
	else if (data.CurrentHP <= 300 && data.CurrentHP >= 1) {
		mainContainer.innerHTML += `
		<div class="tag">
			<i class="fas fa-heartbeat"></i>
		</div>
		<div id="value"><font size="4" color="#ff0000">${data.CurrentHP}</font></div>`;
	}
	
	//Default
	else {
		mainContainer.innerHTML += `
		<div class="tag">
			<i class="fas fa-heartbeat"></i>
		</div>
		<div id="value"><font size="4" color="#ff0000">${data.CurrentHP}</font></div>`;
	}
		
	mainContainer.innerHTML += `
	<div class="tag">
		DA
	</div>
	<div id="value"><font size="4" color="#FFF">${Math.floor(data.CurrentDA)}</font></div>`;

	mainContainer.innerHTML += `
	<div class="tag">
		<i class="fas fa-skull"></i>
	</div>
	<div id="valueBoss"><font size="4" color="#ff0000">0</font></div>`

	mainContainer.innerHTML += `
	<div class="tag">
		<i class="fas fa-street-view"></i>
	</div>
	<div id="valueBoss"><font size="4" color="#FFF">${data.MrEverything}</font></div>`

	mainContainer.innerHTML += `
	<div class="tag">
		<i class="fas fa-file"></i>
	</div>
	<div id="valueBoss"><font size="4" color="#FFF">${data.FileCount}</font></div>`

	mainContainer.innerHTML += `
	<div class="tag">
		<i class="fas fa-coins"></i>
	</div>
	<div id="valueBoss"><font size="4" color="#FFF">${data.CoinCount}</font></div>`

	var BossHP = document.getElementById('valueBoss');

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.MaximumHP != 150 && m.MaximumHP != 1000 && m.MaximumHP != 1100 && m.MaximumHP != 999999 && m.CurrentHP != 0 && isBoss(CurrentMap, m)) });
	//console.log("Filtered Enemies", filterdEnemies);
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		//let result = isBoss(data.MapName, item);
		if (item.IsAlive && index < 1) {
			BossHP.innerHTML = `<font size="4" color="#ff0000">${item.CurrentHP}</font>`;
		}
	});

	function isBoss(data, enemy) {
	if (
		data.includes("Storeroom01") && enemy.MaximumHP === enemyHP[0].easy || 
		data.includes("Ship") && enemy.MaximumHP === enemyHP[0].easy || 
		data.includes("3F") && enemy.MaximumHP === enemyHP[1].easy ||
		data.includes("MainHouse") && enemy.MaximumHP === enemyHP[2].easy || 
		data.includes("RightAreaB1FFreezer") && enemy.MaximumHP === enemyHP[3].easy ||
		data.includes("Boss2F") && enemy.MaximumHP === enemyHP[4].easy ||
		data.includes("OldHouse1FHole01") && enemy.MaximumHP === enemyHP[5].easy && enemyHP[5].isAlive ||
		data.includes("GH1F") && enemy.MaximumHP === enemyHP[6].easy || 
		data.includes("GH2F") && enemy.MaximumHP === enemyHP[6].easy ||
		data.includes("Cowshed01") && enemy.MaximumHP === enemyHP[8].easy || 
		data.includes("Cowshed01") && enemy.MaximumHP === enemyHP[9].easy ||
		data.includes("c04_c013F") && enemy.MaximumHP === enemyHP[7].easy ||
		data.includes("c01Outside01") && enemy.MaximumHP === enemyHP[7].easy) {
		return true;
	}
	
	else if (
		data.includes("Storeroom01") && enemy.MaximumHP === enemyHP[0].hard || 
		data.includes("Ship") && enemy.MaximumHP === enemyHP[0].hard || 
		data.includes("3F") && enemy.MaximumHP === enemyHP[1].hard ||
		data.includes("MainHouse") && enemy.MaximumHP === enemyHP[2].hard || 
		data.includes("RightAreaB1FFreezer") && enemy.MaximumHP === enemyHP[3].hard ||
		data.includes("Boss2F") && enemy.MaximumHP === enemyHP[4].hard ||
		data.includes("OldHouse1FHole01") && enemy.MaximumHP === enemyHP[5].hard && enemyHP[5].isAlive ||
		data.includes("GH1F") && enemy.MaximumHP === enemyHP[6].hard || 
		data.includes("GH2F") && enemy.MaximumHP === enemyHP[6].hard ||
		data.includes("Cowshed01") && enemy.MaximumHP === enemyHP[8].hard || 
		data.includes("Cowshed01") && enemy.MaximumHP === enemyHP[9].hard ||
		data.includes("c04_c013F") && enemy.MaximumHP === enemyHP[7].hard ||
		data.includes("c01Outside01") && enemy.MaximumHP === enemyHP[7].hard) {
		return true;
	} 

	else {
		return false;
	}
}

}
