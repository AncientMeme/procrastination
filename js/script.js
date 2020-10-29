
/*
 * Land System: The methods below are crucial for saving the state
 * of user's land gain
 */

// Reads the land state value and returns it
function loadLandState() {
    // Load the saved land state in the storage
    let landState = sessionStorage.getItem("landState");

    // Generate the entry if none exists, else read the value
    if(landState == null) {
        sessionStorage.setItem("landState", "0");
        return 0;
    } else {
        landState = parseInt(landState);
    }

    return landState;
}

// Call this method to add 1 to land state
function addLand() {
    // Get the current land state and add 1 to it
    let land = loadLandState();
    land++;
    sessionStorage.setItem("landState", land.toString());

    // Debug message
    console.log("Current Land State: " + land);
}

// Safely parse a Stringify JSON
function safeParse(string) {
	var parsedJSON = [];
	if(string != null) {
		parsedJSON = JSON.parse(string);
	}

	return parsedJSON;
}

// Initalize all the acitivty marks
function initializeActivityMarks() {
    if(sessionStorage.getItem("journalLand") == null) {
        sessionStorage.setItem("journalLand", "0");
        sessionStorage.setItem("feedbackLand", "0");
        sessionStorage.setItem("entryLand", "0");
    }
}

// Setup Feedback Submission Button
function SubmitFeedback() {
    // Check if user has submitted feedback
    let feedbackLand = parseInt(sessionStorage.getItem("feedbackLand"));

    if(feedbackLand == 0) {
        document.getElementById("submit-feedback").addEventListener("click", function(button) {
            button.preventDefault();
    
            // Show the feedback window
            ShowFeedback();
        });
    } else {
        // Show the feedback window
        ShowFeedback();
    }
}

// Show the submitted feedback
function ShowFeedback() {
    // Show the comment in the feedback feed
    let article = document.getElementById("user-feedback");
    article.classList.add("show");

    // Change the display for the page
    let textbox = document.getElementById("feedback-textbox");
    let submission = document.getElementById("feedback-submission");
    textbox.classList.add("hide");
    submission.classList.add("hide");

    // Show the thank you message
    let message = document.getElementById("thank-message");
    message.classList.add("show");
}

// Simulate the user feedback upvotes
function FeedbackUpvotes(upvotes) {
    // Divs to modify
    let feedback = document.getElementById("user-feedback");
    let counter = feedback.getElementsByClassName("feedback-footer")[0];

    // Check if the activity was done
    let feedbackMark = parseInt(sessionStorage.getItem("feedbackLand"));

    if(feedbackMark == 0) {
        if(feedback.classList.contains("show")) {
            upvotes++;
            
            counter.getElementsByTagName("p")[0].innerHTML = `${upvotes} / 4`;
        }
    
        if(upvotes < 4) {
            setTimeout(FeedbackUpvotes, 1000, upvotes);
        } else {
            counter.getElementsByTagName("b")[0].classList.add("show");
            sessionStorage.setItem("feedbackLand", "1");
            addLand();
        }
    } else {
        counter.getElementsByTagName("p")[0].innerHTML = `4 / 4`;
        counter.getElementsByTagName("b")[0].classList.add("show");
    }
}

// Simulate the user journal upvotes
function journalUpvotes(upvotes) {
    // Get the Divs to modify
    let footer = document.getElementById("journal-footer");
    let counter = footer.getElementsByTagName("p")[0];
    let message = footer.getElementsByTagName("b")[0];

    // Check for activity mark
    let journalMark = parseInt(sessionStorage.getItem("journalLand"));
    
    // Upvotes when the user enter the page
    if(journalMark == 0) {
        upvotes++;
        counter.innerHTML = `${upvotes} / 4`;
    
        if(upvotes < 4) {
            setTimeout(journalUpvotes, 1000, upvotes);
        } else {
            // Display message and add land, mark this page as well
            message.classList.add("show");
            sessionStorage.setItem("journalLand", "1");
            addLand();
        }
    } else {
        // Display the journal already got upvoted
        counter.innerHTML = `4 / 4`;
        message.classList.add("show");
    }
   
}

// Simualate the upvote buttons
function ActivateUpvoteButton() {
    var UpvoteButtons = document.getElementsByClassName("upvote-button");

    // Make all upvote buttons interactable
    for(var i = 0; i < UpvoteButtons.length; i++) {
        // Find the element that counts upvotes
        let upvoteButton = UpvoteButtons[i];
        let buttonParent = UpvoteButtons[i].parentElement;
        let upvoteSection = buttonParent.getElementsByTagName("p")[0];

        upvoteButton.addEventListener("click", function(button) {
            // Prevent button link
            button.preventDefault();            

            if(!upvoteButton.classList.contains("clicked")) {
                // Add a class so the button only works once
                upvoteButton.classList.add("clicked");

                // Get the current upvote count and add 1
                let currentUpvotes = parseInt(upvoteSection.innerHTML.split(" ")[0]);
                upvoteSection.innerHTML = (currentUpvotes + 1) + " / 4";

                // If the upvote reaches 4 after adding one
                if(currentUpvotes + 1 >= 4) {
                    let landFeedback = buttonParent.getElementsByTagName("b")[0];
                    landFeedback.classList.add("show");
                }
            }
        });
    }
   
}

// Mark if a journal is submitted
function markJournalSubmission() {
    let button = document.getElementById("entry-submit");

    // Mark submission and redirect to journal page
    button.addEventListener("click", function(event) {
        event.preventDefault();
        sessionStorage.setItem("submitted", "1");
        window.location.href = "journal-2.html";
    });
}

// Check if a journal is submitted
function checkJournalSubmission() {
    let submitted = sessionStorage.getItem("submitted");

    if(submitted === "1") {
        document.getElementById("new-journal").classList.add("show");
        document.getElementById("submit-journal").classList.add("hide");
    }
}

// Change the map to fit the current state
function changeMap(map) {
    // Get the correct map
    mapState = loadLandState();
    mapName = "images/map-" + mapState + "-0.png";

    map.src = mapName;
}

// Loads the Javascript once it is ready
document.addEventListener('DOMContentLoaded', function(event) {

    // Initialize activity marks for the first time
    initializeActivityMarks();
    
    // JS for home page
    if(document.getElementById("home-js") != null) {
        checkJournalSubmission();

        let map = document.getElementById("map-preview");
        changeMap(map);
    }

    // JS for all journal pages
    if(document.getElementById("journal-js") != null){
        // Initialize listener for Journal Feedback
        if(document.getElementById("submit-feedback") != null) {
            SubmitFeedback();
            FeedbackUpvotes(0);
        }

        // Simulate upvotes for user journal
        if(document.getElementById("user-entry") != null) {
            journalUpvotes(0);
        }

        // Initalize upvote buttons
        ActivateUpvoteButton();
    }

    // JS for journal submission
    if(document.getElementById("submission-js") != null){
        markJournalSubmission();
    }
    
    // Change Map image according to land state
    if(document.getElementById("map-js") != null) {
        let map = document.getElementById("map");
        changeMap(map);
    }

})