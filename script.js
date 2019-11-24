// set initial values

var timer = document.querySelector("#timerDisplay");
var countdownTimer = 76;
var quizAnswersNode = document.getElementById("quiz-answers");
var storeInitialsNode = document.getElementById("store-initials");
var questionNumber = 0;
var gameIsFinished = false;
var score = 0;
var scoreArray = [];
var scoreTable = document.querySelector("table");

// hide quiz answers and fields to store initials to start
quizAnswersNode.style.display = "none";
storeInitialsNode.style.display = "none";

// function called when user clicks on Start Quiz button
function startQuiz() {

    // reset the questionNumber to 0
    questionNumber = 0;
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

function displayFirstQuestion() {
    // Stop displaying quiz title, rules, and start button
    var quizTitleNode = document.getElementById("quiztitle");
    var quizRulesNode = document.getElementById("quizrules");

    quizTitleNode.textContent = "";
    quizRulesNode.textContent = "";
    document.getElementById("startButton").style.display = "none";

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
    else
        gameOver(countdownTimer);

}

// passes in the number corresponding to the user's answer choice, checks against answer for current question
function checkAnswer(ans) {
    // get the answer that user submitted
    var userAnswer = questions[questionNumber].choices[ans-1];
    // get the correct answer from the question
    var correctAnswer = questions[questionNumber].answer;


    // console.log("user's answer = " + questions[questionNumber].choices[ans-1]);
    // console.log("answer = " + questions[questionNumber].answer);

    // if answer is correct, display correct, else wrong
    // if answer is wrong, take 15 second time penalty off timer
    if(userAnswer == correctAnswer) {
        displayResult("Correct!");
    } else {
        displayResult("Wrong!");
        countdownTimer -= 15;
    }
}

// function that performs cleanup and displays the score (passed in as the timer if game
// ends before time is up)
function gameOver(endingScore) {
    var quizTitleNode = document.getElementById("quiztitle");
    var quizRulesNode = document.getElementById("quizrules");

    // hide the last question and answers
    quizAnswersNode.style.display = "none";
    quizRulesNode.textContent = "";

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

    // display the storeInitials fields
    storeInitialsNode.style.display = "flex";
}

// displays correct or wrong text for 3 seconds, then clears it
function displayResult(str) {
    var resultText = document.getElementById("quiz-result-text");
    var resultTimer = 3;

    resultText.textContent = str;


    var timerInterval = setInterval(function() {
        resultTimer--;
        
        if(resultTimer == 0) {
            clearInterval(timerInterval);
            resultText.textContent = "";
        }
    
      }, 1000);
}

// function to store the user's initals and score in local storage
function submitInitials() {
    var initialsInput = document.getElementById("initials");
    var userInitials = initialsInput.value;
    var initialScorePair = [userInitials, score];
    
    tempArray = localStorage.getItem("scoreArray");
    console.log("tempArray = " + tempArray)

    console.log("scoreArray = " + scoreArray);
    console.log("typeof scoreArray " + typeof(scoreArray))
    scoreArray.push(initialScorePair);
    initialsInput.value = "";
    console.log("scoreArray = " + scoreArray);
    localStorage.setItem("scoreArray", scoreArray);

    displayHighScores();
}

function displayHighScores() {

    generateTable();
}

// function generateTableHead(table) {

//     var heading = document.createElement("th");
//     var hrow = document.createElement("tr");
//     var init = document.createElement("td");
//     var tablescore = document.createElement("td");
//     init.textContent = "Initials";
//     tablescore.textContent = "Score";

//     hrow.appendChild(init);
//     hrow.appendChild(tablescore);
//     heading.appendChild(hrow);
//     table.appendChild(heading);
// }

function generateTable() {

    var table = document.getElementById("high-score-table");
    for(var i = 0; i < scoreArray.length; i+=2) {
        console.log("i = " + i);
        var newRow = document.createElement("tr");
        var newInitials = document.createElement("td");
        var newScore = document.createElement("td");
        newInitials.textContent = scoreArray[i][0];
        newScore.textContent = scoreArray[i][1];
        newRow.appendChild(newInitials);
        newRow.appendChild(newScore);
        table.appendChild(newRow);
    }

}
