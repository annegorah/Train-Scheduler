// Initialize Firebase
var config = {
    apiKey: "AIzaSyDGVdBgFe_oaarJ_XgfQA8XnYP7Idju3uQ",
    authDomain: "train-scheduler-89cb5.firebaseapp.com",
    databaseURL: "https://train-scheduler-89cb5.firebaseio.com",
    projectId: "train-scheduler-89cb5",
    storageBucket: "train-scheduler-89cb5.appspot.com",
    messagingSenderId: "486235984949"
};
firebase.initializeApp(config);

var database = firebase.database();

//initial Variables
var trainName = "";
var departure = "";
var destination = "";
var firstTrain = "";
var frequency = "";

// 2. Button for adding trains
$("#submit-form").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    trainName = $("#train-name-input").val().trim();
    departure = $("#departure-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();


    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        departure: departure,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,

    };

    // Uploads data to the database
    database.ref().push(newTrain);

    console.log(trainName, departure, destination, firstTrain, frequency);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#departure-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");

});

//3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {


    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var departure = childSnapshot.val().departure;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;

    let row = $("<tr>");
    row.addClass("row-class");
    row.attr("data-id", childSnapshot.key);
    let nameTd = $("<td>");
    nameTd.text(trainName);
    let departureTd = $("<td>");
    departureTd.text(departure);
    let destinationTd = $("<td>");
    destinationTd.text(destination);
    let frequencyTd = $("<td>");
    frequencyTd.text(frequency);
    let nextTd = $("<td>");
    let timeAwayTd = $("<td>");
    //cancel-Button bonus
    let cancelTd = $("<td>");
    let cancelButton = $("<button>")
    cancelButton.addClass("btn btn-success text-center delete");
    cancelButton.attr("data-id", childSnapshot.key);
    cancelButton.text("X");

    //button event handler
    cancelButton.on("click", cancelHandler);

    //moment.js
    var tFrequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;

    //first time of train converted
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    //console.log("First time in"+firstTimeConverted);

    //current Time
    var currentTime = moment();
    //console.log("current time "+currentTime);

    //difference between current time and first time
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    //console.log("difference in minutes = "+diffTime);

    var tRemainder = diffTime % tFrequency;
    //console.log("Remainder= "+ tRemainder);

    //minutes until next arrival
    var minutesNextTrain = tFrequency - tRemainder;
    var nextTrain = currentTime.add(minutesNextTrain, "minutes");
    console.log(trainName);
    console.log(minutesNextTrain);
    console.log("------");

    nextTd.text(moment(nextTrain).format("hh:mm"));
    timeAwayTd.text(minutesNextTrain);

    //appending so it shows on the rows
    row.append(nameTd);
    row.append(departureTd);
    row.append(destinationTd);
    row.append(frequencyTd);
    row.append(nextTd);
    row.append(timeAwayTd);
    row.append(cancelTd);
    cancelTd.append(cancelButton);

    row.appendTo("#trains");


    //handle errors
}, function (errorObject) {
    console.log("error handled:" + errorObject.code);
});

//function to cancel button
function cancelHandler() {
    var dataKey = $(this).attr("data-id");
    console.log(dataKey);
    database.ref(dataKey).remove();
    $(`tr[data-id='${dataKey}']`).remove();
};