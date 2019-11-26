// set initial values

var timer = document.querySelector("#timerDisplay");
var countdownTimer = 76;
var quizAnswersNode = document.getElementById("quiz-answers");
var storeInitialsNode = document.getElementById("store-initials");
var buttonsNode = document.getElementById("buttons-row");
var questionNumber = 0;
var gameIsFinished = false;
var score = 0;
var scoreArray = [];
var alertNode = document.getElementById("quiz-result-text");


// hide quiz answers and fields to store initials to start
quizAnswersNode.style.display = "none";
storeInitialsNode.style.display = "none";
buttonsNode.style.display = "none";
alertNode.style.display = "none";

// function called when user clicks on Start Quiz button
function startQuiz() {

    // reset the questionNumber to 0, timer to 76
    questionNumber = 0;
    countdownTimer = 76;    

    // Clear the startup screen and display the first quiz question
    displayFirstQuestion();
    
    //start a timer and display it counting down each second
    var timerInterval = setInterval(function() {
        countdownTimer--;
        timer.textContent = "Timer: " + countdownTimer + " seconds";
    
        // if the timer is <=0, either due to counting down or 
        // penalties from wrong answers, end the game
        if(countdownTimer <= 0) {
            timer.textContent = "";
            clearInterval(timerInterval);
            
            if(!gameIsFinished) {
                // time is up, so game ends with a score of 0
                gameOver(0);
            }
        }
    
    }, 1000);
}


// set up the screen and display the first quiz question
function displayFirstQuestion() {
    
    // hide storeInitialsNode and buttonsNode
    storeInitialsNode.style.display = "none";
    buttonsNode.style.display = "none";

    // Stop displaying quiz title, rules, and start button
    var quizTitleNode = document.getElementById("quiztitle");
    var quizRulesNode = document.getElementById("quizrules");

    quizTitleNode.textContent = "";
    quizRulesNode.textContent = "";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("high-scores").style.display = "none";

    // display the first quiz question

    displayQuizQuestion(0);

}

// displays the ith Quiz question from questions.js
function displayQuizQuestion(i) {
    // get the nodes that display the question and answers
    var quizRulesNode = document.getElementById("quizrules");
    var answer1Node = document.getElementById("answer1");
    var answer2Node = document.getElementById("answer2");
    var answer3Node = document.getElementById("answer3");
    var answer4Node = document.getElementById("answer4");

//    console.log("questions[i].choices[0] = " + questions[i].choices[0]);

    // show the answers div, and populate it with the questions and
    // answers to questions[i]
    quizAnswersNode.style.display = "flex";
    quizRulesNode.textContent = questions[i].title;
    answer1Node.textContent = questions[i].choices[0];
    answer2Node.textContent = questions[i].choices[1];
    answer3Node.textContent = questions[i].choices[2];
    answer4Node.textContent = questions[i].choices[3];
}

// function that is called when an answer button is clicked
// ans is a integer from 1 to 4 corresponding to which answer was selected
function submitAnswer(ans) {
 
    // check the answer submitted to see if it is correct/wrong
    checkAnswer(ans);
    
    // go to next question
    questionNumber++;

    // if there are more questions, display next question, otherwise game is over, calculate score
    if(questionNumber < questions.length)
        displayQuizQuestion(questionNumber);
    else {
        gameOver(countdownTimer);
    }
}

// passes in the number corresponding to the user's answer choice, checks against answer for current question
function checkAnswer(ans) {
    // get the answer that user submitted
    var userAnswer = questions[questionNumber].choices[ans-1];
    // get the correct answer from the question
    var correctAnswer = questions[questionNumber].answer;

    // if answer is correct, display correct, else wrong
    // if answer is wrong, take 15 second time penalty off timer
    if(userAnswer == correctAnswer) {
        displayResult("Correct!");
    } else {
        displayResult("Wrong!");
        countdownTimer -= 15;
    }
}

// displays correct or wrong text for 3 seconds, then clears it
function displayResult(str) {
    var resultText = document.getElementById("quiz-result-text");
    var resultTimer = 3;
    var newP = document.createElement("p");
    newP.setAttribute("class", "text-center");

    resultText.innerHTML = "";
    resultText.appendChild(newP);

    resultText.style.display = "flex";
    if(str == "Wrong!") {
        resultText.removeAttribute("class");
        resultText.setAttribute("class", "alert alert-danger text-center");
    } else {
        resultText.removeAttribute("class");
        resultText.setAttribute("class", "alert alert-success text-center");

    }
    newP.textContent = str;

    // displays string for resultTimer seconds, then clears
    var timerInterval = setInterval(function() {
        resultTimer--;
        
        if(resultTimer == 0) {
            clearInterval(timerInterval);
            resultText.style.display = "none";
        }
    
      }, 1000);
}


// function that performs cleanup and displays the score (passed in as the timer if game
// ends before time is up)
function gameOver(endingScore) {
    var quizTitleNode = document.getElementById("quiztitle");
    var quizRulesNode = document.getElementById("quizrules");

    // hide the last question and answers
    quizAnswersNode.style.display = "none";
    quizRulesNode.textContent = "";

    // show the high score list
    document.getElementById("high-scores").style.display = "flex";

    // sets the timer to 0 because game is over
    countdownTimer = 0;
    

    // if timer went negative because of penalties, reset score to zero
    if(endingScore < 0)
    endingScore = 0;
    
    // set a boolean to mark that game is finished
    gameIsFinished = true;

    score = endingScore;

    // display the final score
    quizTitleNode.textContent = "Game over! Score: " + score;

    // Reset submit-initials button
    document.getElementById("submit-initials-button").disabled = false;

    // display the storeInitials fields and buttons
    storeInitialsNode.style.display = "flex";
    buttonsNode.style.display = "flex";
}




function submitInitials() {
    var initialsInput = document.getElementById("initials");
    var userInitials = initialsInput.value;
    initialsInput.value = "";
    var initialArray = [];
    var scores = [];
    document.getElementById("submit-initials-button").disabled = true;


    initialArray = JSON.parse(localStorage.getItem("inits") || "[]");
    scores = JSON.parse(localStorage.getItem("scores") || "[]");

    console.log("scores = " + scores);
    console.log("initialArray = " + initialArray);

    scores.push(score);
    initialArray.push(userInitials);

    localStorage.setItem("inits", JSON.stringify(initialArray));
    localStorage.setItem("scores", JSON.stringify(scores));

    generateTable(initialArray, scores);

}

function displayHighScores() {

    initialArray = JSON.parse(localStorage.getItem("inits") || "[]");
    scores = JSON.parse(localStorage.getItem("scores") || "[]");

    generateTable(initialArray, scores);
}

function generateTable(initA, scoreA) {

    var list = document.getElementById("high-score-list");
    document.getElementById("high-scores").style.display = "flex";

    document.getElementById("high-score-list").innerHTML = "";
    var newRow = document.createElement("div")
    newRow.setAttribute("class", "row");
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "col-2");
    var newDiv2 = document.createElement("div");
    newDiv2.setAttribute("class", "col-2");
    newDiv.textContent = "Initials";
    newDiv2.textContent = "Score";
    newRow.appendChild(newDiv);
    newRow.appendChild(newDiv2);
    list.appendChild(newRow);

    for(var i = 0; i < scoreA.length; i++) {

        var storedInitials = initA[i];
        var storedScore = scoreA[i];
        console.log("storedInitials = " + storedInitials);
        console.log("storedScore = " + storedScore);

        newRow = document.createElement("div")
        newRow.setAttribute("class", "row");

        newDiv = document.createElement("div");
        newDiv.setAttribute("class", "col-2");
        newDiv.textContent = storedInitials;

        newDiv2 = document.createElement("div");
        newDiv2.setAttribute("class", "col-2");
        newDiv2.textContent = storedScore;

        newRow.appendChild(newDiv);
        newRow.appendChild(newDiv2);
        list.appendChild(newRow);
    
    }
}

// Clear out the stored score list from localStorage
function clearInitials() {

    localStorage.removeItem("inits");
    localStorage.removeItem("scores");
    generateTable([], []);
}