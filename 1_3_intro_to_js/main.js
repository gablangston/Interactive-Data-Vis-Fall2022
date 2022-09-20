// This code controls how to interact with the button

// Loop that increases the counts of clicks

let counter_display = 0

const clickCounts = () => {
	counter_display = counter_display + 1
	document.getElementById("counter_display").innerHTML = counter_display;
}