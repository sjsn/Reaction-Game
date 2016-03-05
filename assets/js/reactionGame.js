/*
	Reaction Game is made by Samuel San Nicolas.
*/

// Anonymizes the function to eliminate global variables
(function() {
	"use strict";

	var timer = null; // Interval variable
	var correct = 0; // Total number of points
	var time = 0; // Total time elapsed
	var timeCheck = time + (intervalTime * 100); // When the interval should end
	var running = true; // If the game is in a "playing" state
	var guessTime = 0; // Total time of current guess
	var questions = []; // Log of each question asked
	var guesses = []; // Log of how long between each guess
	var bestTime = 4; // Default best guess time
	var intervalTime = 4; // Initial time between intervals (initial = 4 sec)
	var OPTIONS = ["black", "purple", "blue", "cyan", "green", "yellow", 
	"orange", "pink", "red"];
	var sounds = true; // If the player clicked mute or not

	// Anonymous function that is called when the page loads
	window.onload = function() {
		// Causes the word 'color' in the title to change colors
		changeColor();
		// Toggles the sound if the player clicks mute
		document.getElementById("sound").onclick = mute;
		// Creates the start button for the game
		makeButton("Start");
	};

	// Initializes the color change of the word 'color' in the title
	function changeColor() {
		var letters = ["c", "o1", "l", "o2", "r"];
		var randIndex = Math.floor(Math.random() * OPTIONS.length);
		for (var i = 0; i < letters.length; i++) {
			if (randIndex == 0 || randIndex == OPTIONS.length) {
				randIndex = 1;
			}
			document.getElementById(letters[i]).style.color = OPTIONS[randIndex];
			randIndex++;
		}
	}

	// Toggles the sound if the player clicks mute
	function mute() {
		sounds = !sounds;
		var img = document.getElementById("muted");
		if (sounds) {
			img.src = "assets/img/play.png";
		} else {
			img.src = "assets/img/mute.png";
		}
	}

	// Creates the start button for the game
	function makeButton(text) {
		var area = document.getElementById("playArea");
		var button = document.createElement("div");
		button.innerHTML = text + "!";
		button.onmouseover = mouseOver;
		button.onmouseleave = mouseLeave;
		button.onclick = preGame;
		button.id = text;
		area.appendChild(button);
	}

	// Changes button style on mouse over
	function mouseOver() {
		this.style.backgroundColor = "#56adef";
		this.style.color = "#e5e5e5";
		this.style.cursor = "pointer";
	}

	// Changes button style on mouse leave
	function mouseLeave() {
		this.style.backgroundColor = "#44a4ee";
		this.style.color = "#FFFFFF";
		this.style.cursor = "auto";
	}

	// Creates a playable game state
	function makeGame() {
		document.getElementById("points").innerHTML = correct;
		time++;
		guessTime++;
		if (time > timeCheck) {
			clearInterval(timer);
			timer = null;
			lose();
		} else if (running) {
			running = false;
			var area = document.getElementById("playArea");
			area.innerHTML = "";
			var colors = createOptions();
			var words = createOptions();
			drawGame(colors, words);
		}
	}

	// Helper function that returns 4 pairs of colors to be used as answer options
	function createOptions() {
		var colors = [];
		while (colors.length < 4) {
			var randIndex = Math.floor(Math.random() * OPTIONS.length);
			var color = OPTIONS[randIndex];
			var isNew = true;
			for (var i = 0; i < colors.length; i++) {
				if (colors[i] == color) {
					isNew = false;
				}
			}
			if (isNew) {
				colors.push(color);
			}
		}
		return colors;
	}

	/* Generates a question and 4 options based on the color options 
	returned from createOptions */
	function drawGame(colors, words) {
		var area = document.getElementById("playArea");
		var rand = Math.round(Math.random()); // 0 or 1
		var color;
		var option;
		if (rand) {
			option = "color";
			color = colors[Math.floor(Math.random() * colors.length)];
		} else {
			option = "word";
			color = words[Math.floor(Math.random() * colors.length)];
		}
		var instr = document.createElement("p");
		var word = document.createElement("span");
		if (color == "yellow") {
			word.style.color = "#e5e500";
		} else {
			word.style.color = color;
		}
		word.innerHTML = color;
		instr.innerHTML = "Click the " + option + " ";
		instr.id = "instructions";
		instr.appendChild(word);
		area.appendChild(instr);
		questions.push(instr.innerHTML);
		var wordArea = document.createElement("div");
		wordArea.id = "wordArea";
		area.appendChild(wordArea);
		for (var i = 0; i < colors.length; i++) {
			var item = document.createElement("div");
			item.innerHTML = words[i];
			// Changes yellow from default color for visibility
			if (colors[i] == "yellow") {
				item.style.color = "#e5e500";
			} else {
				item.style.color = colors[i];
			}
			item.id = "item";
			if (i < 2) {
				item.style.top = "0px";
			} else {
				item.style.top = "160px";
			}
			item.style.left = ((i + 2) % 2) * 200 + "px";
			if (isAnswer(option, color, colors[i], words[i])) {
				item.onclick = win;
			} else {
				item.onclick = lose;
			}
			wordArea.appendChild(item);
		}
	}

	// Helper function to check if the answer clicked is the correct answer
	function isAnswer(option, test, color, word) {
		if (option == "color" && test == color) {
			return true;
		} else if (option == "word" && test == word) {
			return true;
		} else {
			return false;
		}
	}

	// Called if answer clicked was correct answer. Changes stats accordingly
	function win() {
		if (sounds) {
			var sound = new Audio("assets/sounds/win.wav");
			sound.play();
		}
		running = true;
		if (intervalTime > 1.25) {
			intervalTime -= 0.25;
		}
		timeCheck = time + (intervalTime * 100);
		guesses.push(guessTime);
		guessTime = guessTime / 100;
		if (guessTime < bestTime) {
			bestTime = guessTime;
		}
		guessTime = 0;
		correct++;
		clearInterval(timer);
		timer = null;
		timer = setInterval(makeGame, 10)
	}

	/* Called if answer picked was incorrect. Displays stats about game
	and generates a table of questions and response times */
	function lose() {
		if (sounds) {
			var sound = new Audio("assets/sounds/loss.wav");
			sound.play();
		}
		var lossWord;
		var lossColor;
		if (this) {
			lossWord = this.innerHTML;
			lossColor = this.style.color;
		} else {
			lossWord = "nothing";
			lossColor = "black"
		}
		running = true;
		clearInterval(timer);
		timer = null;
		var avgGuess = calcGuesses();
		document.getElementById("playArea").innerHTML = "";
		document.getElementById("statsArea").style.display = "initial";
		document.getElementById("pointStats").innerHTML = "Total Points: " + correct;
		time = Math.round(time / 100);
		document.getElementById("timeStats").innerHTML = "Total Time: " + time + " seconds";
		document.getElementById("avgGuess").innerHTML = "Average Reaction Time: " + avgGuess + " seconds";
		if (bestTime != 4) {
			document.getElementById("avg").style.display = "initial";
			document.getElementById("avg").innerHTML = "Fastest Reaction Time: " + bestTime + " seconds";
		}
		drawResults(lossWord, lossColor);
		makeButton("Retry");
	}

	// Helper function to calculate the average guess time
	function calcGuesses() {
		var numGuesses = guesses.length;
		var totalGuess = 0;
		for (var i = 0; i < numGuesses; i++) {
			totalGuess += guesses[i];
		}
		totalGuess = totalGuess / numGuesses;
		if (totalGuess) {
			return Math.floor(totalGuess * 10) / 1000;
		} else {
			return 0;
		}
	}

	// Helper function to draw a table displaying questions and guess times
	function drawResults(lossWord, lossColor) {
		var results = document.createElement("h2");
		results.innerHTML = "Results:";
		document.getElementById("tableArea").appendChild(results);
		var table = document.createElement("table");
		table.id = "resultsTable";
		var row = document.createElement("tr");
		var title1 = document.createElement("th");
		var title2 = document.createElement("th");
		title1.innerHTML = "Instructions";
		title2.innerHTML = "Response Time";
		row.appendChild(title1);
		row.appendChild(title2);
		table.appendChild(row);
		for (var i = 0; i < guesses.length; i++) {
			var row = document.createElement("tr");
			var cell1 = document.createElement("td");
			var cell2 = document.createElement("td");
			cell1.innerHTML = questions[i];
			cell2.innerHTML = (guesses[i] / 100) + " sec";
			row.appendChild(cell1);
			row.appendChild(cell2);
			table.appendChild(row);
		}
		var row = document.createElement("tr");
		var cell1 = document.createElement("td");
		var cell2 = document.createElement("td");
		cell1.innerHTML = questions.pop();
		var span = document.createElement("span");
		span.id = "lossColor";
		span.style.color = lossColor;
		span.innerHTML = lossWord;
		cell2.innerHTML = "You clicked ";
		cell2.appendChild(span);
		row.appendChild(cell1);
		row.appendChild(cell2);
		table.appendChild(row);
		document.getElementById("tableArea").appendChild(table);
	}

	/* Resets game board and initiates a 3 second countdown for the 
	game to start */
	function preGame() {
		document.getElementById("statsArea").style.display = "none";
		document.getElementById("avg").style.display = "none";
		document.getElementById("points").innerHMTML = "0"Isdso;
		time = 0;
		correct = 0;
		bestTime = 4;
		intervalTime = 4;
		timeCheck = time + (intervalTime * 100);
		guessTime = 0;
		guesses = [];
		questions = [];
		document.getElementById("tableArea").innerHTML = "";
		var area = document.getElementById("playArea");
		area.innerHTML = "";
		var num = document.createElement("p");
		num.id = "num";
		num.innerHTML = "3";
		if (sounds) {
			var sound = new Audio("assets/sounds/count.wav");
			sound.play();
		}
		area.appendChild(num);
		timer = setInterval(countDown, 1000);
	}

	// 3 second countdown timer that happens before each game officially starts
	function countDown() {
		var num = document.getElementById("num");
		var count = parseInt(num.innerHTML);
		if (count) {
			count--;
			if (count == 0) {
				if (sounds) {
					var sound = new Audio("assets/sounds/start.wav");
					sound.play();
				}
				num.style.left = "260px"
				num.style.color = "green";
				num.innerHTML = "Go!";
			} else {
				if (sounds) {
					var sound = new Audio("assets/sounds/count.wav");
					sound.play();
				}
				document.getElementById("num").innerHTML = "" + count;
			}
		} else {
			clearInterval(timer);
			makeGame();
			timer = setInterval(makeGame, 10);
		}
	}
}) ();