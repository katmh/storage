// attaches functions to buttons
document.getElementById("continue").addEventListener("click", saveData);
document.getElementById("clear").addEventListener("click", clearData);

// if already have stored data, load them and show demo
if (localStorage.name) { // checks to see if there is a localStorage variable called name
    document.getElementById("first-name").value=localStorage.name;
    document.getElementById("color").value=localStorage.color;
    document.getElementById("animal").value=localStorage.animal;
    document.getElementById("text").value=localStorage.text;
}

// function to clear data
function clearData() {
    localStorage.clear();
    document.location.reload();
}

function saveData() {
    // ties data to localStorage variables
    localStorage.name = document.getElementById("first-name").value;
    localStorage.color = document.getElementById("color").value;
    localStorage.animal = document.getElementById("animal").value;
    localStorage.text = document.getElementById("text").value;

    // this is the actual speed measuring part
    // ties localStorage data to variables, puts them into innerHTML of "view" element

    // use performance.now() to get function time accurate to 1/1000th ms
    // unlike Date.now, represent times w/ microsecond precision & are not affected by system clock
    var t0 = performance.now();
        document.getElementById("view").innerHTML = "Name: " + localStorage.getItem("name") + "<br>" +
                                                    "Color: " + localStorage.getItem("color") + "<br>" +
                                                    "Animal: " + localStorage.getItem("animal") + "<br>" +
                                                    "Filler text: " + localStorage.getItem("text");
    var t1 = performance.now();

    var time = t1 - t0;
    document.getElementById("result").innerHTML = "It took <b>" + time + "</b> microseconds to retrieve the stored data, displayed below:"
}
