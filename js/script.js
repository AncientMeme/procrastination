
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

// Setup Feedback Submission Button
function SubmitFeedback() {
    document.getElementById("submit-feedback").addEventListener("click", function(button) {
        button.preventDefault();

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
    });
}

// Simulate the user upvotes
function FeedbackUpvotes(upvotes) {
    let feedback = document.getElementById("user-feedback");
    let counter = feedback.getElementsByClassName("feedback-footer")[0];
    if(feedback.classList.contains("show")) {
        upvotes++;
        
        counter.getElementsByTagName("p")[0].innerHTML = `${upvotes} / 4`;
    }

    if(upvotes < 4) {
        setTimeout(FeedbackUpvotes, 1500, upvotes);
    } else {
        counter.getElementsByTagName("b")[0].classList.add("show");
        addLand();
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

// Loads the Javascript once it is ready
document.addEventListener('DOMContentLoaded', function(event) {

    // JS for home page
    if(document.getElementById("home-js") != null) {
        checkJournalSubmission();
    }

    // JS for all journal pages
    if(document.getElementById("journal-js") != null){
        // Initialize listener for Journal Feedback
        if(document.getElementById("submit-feedback") != null) {
            SubmitFeedback();
            FeedbackUpvotes(0);
        }

        // Initalize upvote buttons
        ActivateUpvoteButton();
    }

    if(document.getElementById("submission-js") != null){
        markJournalSubmission();
    }
    
    // Change Map image according to land state


})

document.addEventListener('DOMContentLoaded', function(event) {

    if (window.location.hash === '#new-journal') {
        submitJournal();
    }

})


function submitJournal() {

   document.getElementById("new-journal").style.display = "block";

}