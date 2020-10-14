
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
        let article = document.getElementById("user-feedback");
        article.classList.add("show");
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

// Loads the Javascript once it is ready
document.addEventListener('DOMContentLoaded', function(event) {

    // Initialize listener for Journal Feedback
    SubmitFeedback();
    FeedbackUpvotes(0);
})