$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5A4-WF8yHg0VTvMYsVztQcU9hrPmR6ic",
        authDomain: "train-schedule-c6526.firebaseapp.com",
        databaseURL: "https://train-schedule-c6526.firebaseio.com",
        projectId: "train-schedule-c6526",
        storageBucket: "train-schedule-c6526.appspot.com",
        messagingSenderId: "675467477925"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#add-train").on("click", function () {
        var trainName = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#first-train").val().trim();
        var frequency = $("#frequency").val().trim();

        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };

        database.ref().push(newTrain);

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
    });

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var destinatinon = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;

        console.log("Train Name: " + trainName);
        console.log("City/State: " + destinatinon);
        console.log(firstTrain + " (HH:mm - Military Time)");
        console.log("Every " + frequency + " Minutes");

        var conFrequency = parseInt(frequency);
        var currentTime = moment();

        console.log("Current time: " + moment().format("HHmm A"));

        var dateConvert = moment(childSnapshot.val().firstTrain, "HHmm A").subtract(1, "years");
        console.log("Date Converted: " + dateConvert);

        var trainTime = moment(dateConvert).format("HHmm A");
        console.log("Train Time: " + trainTime);

        var timeConvert = moment(trainTime, "HHmm A").subtract(1, "years");
        var timeDifference = moment().diff(moment(timeConvert), "minutes");
        console.log("Difference in time: " + timeDifference);

        var timeRemaining = timeDifference % frequency;
        console.log("Time remaining: " + timeRemaining);

        var timeAway = frequency - timeRemaining;
        console.log("Minutes until next train: " + timeAway);

        var nextArrival = moment().add(timeAway, "minutes");
        console.log("Arrival time: " + moment(nextArrival).format("HHmm A"));

        var arrivalDisplay = moment(nextArrival).format("HHmm A");

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destinatinon),
            $("<td>").text(firstTrain),
            $("<td>").text(frequency),
            $("<td>").text(arrivalDisplay)
        );

        $("#train-table").append(newRow);
    })

});