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

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destinatinon),
            $("<td>").text(frequency),
            $("<td>").text(nextTrain.format("hh:mm")),
            $("<td>").text(tMinutesTillTrain)
        );

        $("#train-table").append(newRow);
    })

});