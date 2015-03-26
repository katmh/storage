// create an instance of a db object for us to store the IDB data in
var db;

// create a blank instance of the object that is used to transfer data into the IDB
// referenced in addData function
var newItem = [
      { name: "", color: "", animal: "", text: "" }
    ];

// all the variables we need for the app
var view = document.getElementById('view');
var taskForm = document.getElementById('task-form');
var name = document.getElementById('name');
var color = document.getElementById('color');
var animal = document.getElementById('animal');
var text = document.getElementById('text');

window.onload = function() {
  var DBOpenRequest = window.indexedDB.open("data", 1);

  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
    displayData();
  };

  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    // create an objectStore for this database
    var objectStore = db.createObjectStore("data", { keyPath: "name" });

    // define what items the objectStore will contain
    objectStore.createIndex("color", "color", { unique: false });
    objectStore.createIndex("animal", "animal", { unique: false });
    objectStore.createIndex("text", "text", { unique: false });
  };

  function displayData() {
    // clear task list so you don't get long list of duplicates each time
    view.innerHTML = "";

    // open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    var objectStore = db.transaction('data').objectStore('data');

    objectStore.openCursor().onsuccess = function(event) {
    // start timing here, it will time how long it takes to scan and display the first item
    var t0 = performance.now();
      var cursor = event.target.result;
        if(cursor) {
          document.getElementById("view").innerHTML = "Name: " + cursor.value.name + "<br>" +
                               "Color: " + cursor.value.color + "<br>" +
                               "Animal: " + cursor.value.animal + "<br>" +
                               "Text: " + cursor.value.text;
          cursor.continue();
        }
    var t1 = performance.now();
    var time = t1 - t0;
    document.getElementById("result").innerHTML = "It took <b>" + time + "</b> microseconds to retrieve and display the stored data."
    }
  }

  // give the continue button an event listener so that when the form is submitted the addData() function is run
  document.getElementById("continue").addEventListener("click", addData);

  function addData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    alert(document.getElementById('first').value);

      // grab the values entered into the form fields and store them in an object ready for being inserted into the IDB
      var newItem = [
        { name: document.getElementById('first').value, color: color.value, animal: animal.value, text: text.value }
      ];

      // open a read/write db transaction, ready for adding the data
      var transaction = db.transaction(["data"], "readwrite");

      // report on the success of opening the transaction
      transaction.oncomplete = function() {
        displayData();
      };

      // call an object store that's already been added to the database
      var objectStore = transaction.objectStore("data");
      console.log("index names: " + objectStore.indexNames);
      console.log("keypath: " + objectStore.keyPath);
      console.log("name: " + document.getElementById('first').value);
      console.log("object store name: " + objectStore.name);
      console.log("transaction: " + objectStore.transaction);
      console.log("auto increment: " + objectStore.autoIncrement);

      // add our newItem object to the object store
      var objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = function(event) {
          // clear the form, ready for adding the next entry
          name.value = '';
          color.value = null;
          animal.value = null;
      };

    };

  function deleteItem(event) {
    // retrieve the name of the task we want to delete
    var dataTask = event.target.getAttribute('data-task');

    // open a database transaction and delete the task, finding it by the name we retrieved above
    var transaction = db.transaction(["data"], "readwrite");
    var request = transaction.objectStore("data").delete(dataTask);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
      // delete the parent of the button, which is the list item, so it no longer is displayed
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    };
  };
  }
