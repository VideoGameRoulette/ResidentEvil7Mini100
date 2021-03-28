const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

var json;

var InventoryCount;
var PlayerInventory;
var PreviousMap = "";
var CurrentMap = "";
var enemyHP = [];

function InitBosses() {
	enemyHP = [];
	enemyHP.push({ isAlive: true, name: "MIA1", easy: 700, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "MIA2", easy: 2000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "JACK1", easy: 10000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "JACK2", easy: 4500, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "JACK3", easy: 30000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "MARG1", easy: 1500, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "MARG2", easy: 15000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "EVE", easy: 6000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "FATM", easy: 10000, normal: 0, madhouse: 0 });
	enemyHP.push({ isAlive: true, name: "FATM2", easy: 0, normal: 0, madhouse: 0 });
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

function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	var currentMap = data.MapName.split('\0');

	if (currentMap[0].includes("Ship3FInfirmaryPast") && PreviousMap != currentMap[0])
	{
		console.log("New Run Started Reseting Boss Values...");
		InitBosses();
	}
	PreviousMap = currentMap[0];

	var deadEnemies = data.EnemyHealth.filter(e => {return !e.IsAlive});

	deadEnemies.map(enemy => {
		if (enemy.MaximumHP == 1500) {
			enemyHP[5].isAlive = false;
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

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.MaximumHP != 150 && m.MaximumHP != 1000 && m.MaximumHP != 1100 && m.MaximumHP != 999999 && m.CurrentHP != 0 && isBoss(data.MapName, m)) });
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
	if (data.includes("Storeroom01") && enemy.MaximumHP === 700 || data.includes("Ship") && enemy.MaximumHP === 700 || data.includes("3F") && enemy.MaximumHP === 2000) {
		return true;
	} 
	else if (data.includes("MainHouse") && enemy.MaximumHP === 10000 || data.includes("RightAreaB1FFreezer") && enemy.MaximumHP === 4500) {
		return true;
	}
	else if (data.includes("OldHouse1FHole01") && enemy.MaximumHP === 1500) {
		return true;
	}
	else if (data.includes("GH1F") && enemy.MaximumHP === 15000 || data.includes("GH2F") && enemy.MaximumHP === 15000) {
		return true;
	} 
	else if (data.includes("Cowshed01") && enemy.MaximumHP === 10000 || data.includes("Cowshed01") && enemy.MaximumHP === 10000) {
		return true;
	}
	else if (data.includes("Boss2F") && enemy.MaximumHP === 30000) {
		return true;
	}
	else {
		return false;
	}
}

}
