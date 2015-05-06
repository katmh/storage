// attaches functions to buttons
document.getElementById("continue").addEventListener("click", saveData);
document.getElementById("clear").addEventListener("click", clearData);
document.getElementById("display").addEventListener("click", displayDemo);

// if already have stored data, load them and show demo
if (localStorage.name) { // checks to see if there is a localStorage variable called name
    document.getElementById("first-name").value=localStorage.name;
    document.getElementById("color").value=localStorage.color;
    document.getElementById("animal").value=localStorage.animal;
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

    var t0 = performance.now();
        document.getElementById("view").innerHTML = "Name: " + localStorage.getItem("name") + "<br>" +
                                                    "Color: " + localStorage.getItem("color") + "<br>" +
                                                    "Animal: " + localStorage.getItem("animal");
    var t1 = performance.now();

    var time = t1 - t0;
    document.getElementById("result").innerHTML = "It took <b>" + time + "</b> microseconds to retrieve the stored data, displayed below:"
}

function displayDemo() {}
