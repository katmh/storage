// same as indexeddb.js, but without comments in timed section (lines 83-89)

// create a reference to the notifications list in the bottom of the app; we will write database messages into this list by appending list items on to the inner HTML of this variable - this is all the lines that say note.innerHTML += '<li>foo</li>';
var note = document.getElementById('notifications');

// create an instance of a db object for us to store the IDB data in
var db;

// create a blank instance of the object that is used to transfer data into the IDB
// referenced in addData function
var newItem = [
      { name: "", color: "", animal: "", text: "" }
    ];

// all the variables we need for the app
var taskList = document.getElementById('task-list');

var taskForm = document.getElementById('task-form');
var title = document.getElementById('title');
var name = document.getElementById('name');

var color = document.getElementById('color');
var animal = document.getElementById('animal');
var text = document.getElementById('text');

var submit = document.getElementById('submit');

// initialize app on window load
window.onload = function() {
  note.innerHTML += '<li>App initialised.</li>';

  // open database
  var DBOpenRequest = window.indexedDB.open("toDoList", 4);

  // these two event handlers act on the database being opened successfully, or not
  DBOpenRequest.onerror = function(event) {
    note.innerHTML += '<li>Error loading database.</li>';
  };

  DBOpenRequest.onsuccess = function(event) {
    note.innerHTML += '<li>Database initialised.</li>';

    // store the result of opening the database in the db variable. This is used a lot below
    db = DBOpenRequest.result;

    // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
    displayData();
  };

  // This event handles the event whereby a new version of the database needs to be created
  // Either one has not been created before, or a new version number has been submitted via the
  // window.indexedDB.open line above
  // it is only implemented in recent browsers
  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    db.onerror = function(event) {
      note.innerHTML += '<li>Error loading database.</li>';
    };

    // Create an objectStore for this database

    var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" }); // TODO: keyPath: "name"

    // define what data items the objectStore will contain

    objectStore.createIndex("color", "color", { unique: false });
    objectStore.createIndex("animal", "animal", { unique: false });
    objectStore.createIndex("text", "text", { unique: false });

    note.innerHTML += '<li>Object store created.</li>';
  };

  function displayData() {
    // clear task list so you don't get long list of duplicates each time
    taskList.innerHTML = "";

    // open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    var objectStore = db.transaction('toDoList').objectStore('toDoList');

    objectStore.openCursor().onsuccess = function(event) {
    // start timing here, it will time how long it takes to scan the table and display it
    var t0 = performance.now();
      var cursor = event.target.result;
        if(cursor) {
          var listItem = document.createElement('li');
          listItem.innerHTML = cursor.value.taskTitle + ' — ' + cursor.value.color + ', ' + cursor.value.animal + ', ' + cursor.value.text + '.';
          taskList.appendChild(listItem);
    var t1 = performance.now();
    var time = t1 - t0;
    document.getElementById("result").innerHTML = "It took <b>" + time + "</b> milliseconds to retrieve and display the stored data."

          // create a delete button inside each list item, giving it an event handler so that it runs the deleteButton()
          // function when clicked
          var deleteButton = document.createElement('button');
          listItem.appendChild(deleteButton);
          deleteButton.innerHTML = 'X';
          // here we are setting a data attribute on our delete button to say what task we want deleted if it is clicked!
          deleteButton.setAttribute('data-task', cursor.value.taskTitle); // TODO: cusor.value.name
          deleteButton.onclick = function(event) {
            deleteItem(event);
          }

          // continue on to the next item in the cursor
          cursor.continue();

        // if there are no more cursor items to iterate through, say so, and exit the function
        } else {
          note.innerHTML += '<li>Entries all displayed.</li>';
        }
      }
    }

  // give the form submit button an event listener so that when the form is submitted the addData() function is run
  taskForm.addEventListener('submit',addData,false);

  function addData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

      // grab the values entered into the form fields and store them in an object ready for being inserted into the IDB
      var newItem = [
        { taskTitle: title.value, color: color.value, animal: animal.value, text: text.value }
        // TODO: { name: name.value, color: color.value, animal: animal.value, text: text.value }
      ];

      // open a read/write db transaction, ready for adding the data
      var transaction = db.transaction(["toDoList"], "readwrite");

      // report on the success of opening the transaction
      transaction.oncomplete = function() {
        note.innerHTML += '<li>Transaction completed: database modification finished.</li>';

        // update the display of data to show the newly added item, by running displayData() again.
        displayData();
      };

      transaction.onerror = function() {
        note.innerHTML += '<li>Transaction not opened due to error: ' + transaction.error + '</li>';
      };

      // call an object store that's already been added to the database
      var objectStore = transaction.objectStore("toDoList");
      console.log("index names: " + objectStore.indexNames);
      console.log("keypath: " + objectStore.keyPath);
      console.log("object store name: " + objectStore.name);
      console.log("transaction: " + objectStore.transaction);
      console.log("auto increment: " + objectStore.autoIncrement);

      // add our newItem object to the object store
      var objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = function(event) {

          // report the success of our new item going into the database
          note.innerHTML += '<li>New item added to database.</li>';

          // clear the form, ready for adding the next entry
          title.value = '';
          // TODO: name.value = '';
          color.value = null;
          animal.value = null;
      };

    };

  function deleteItem(event) {
    // retrieve the name of the task we want to delete
    var dataTask = event.target.getAttribute('data-task');

    // open a database transaction and delete the task, finding it by the name we retrieved above
    var transaction = db.transaction(["toDoList"], "readwrite");
    var request = transaction.objectStore("toDoList").delete(dataTask);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
      // delete the parent of the button, which is the list item, so it no longer is displayed
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);
      note.innerHTML += '<li>Task \"' + dataTask + '\" deleted.</li>';
    };
  };
  }
