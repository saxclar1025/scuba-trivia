$("document").ready(function(){
    var Question = function(q, a0, a1, a2, a3, c, i, a) {
        this.question = q;
        this.answers = [ a0,
                         a1,
                         a2,
                         a3 ];
        this.correctAnswerIndex = c;
        this.imagePath = i;
        this.audioPath = a;

        this.getCorrectAnswer = function() {return this.answers[this.correctAnswerIndex];};
        this.getAnswer = function(index) {return this.answers[index];};
        this.isCorrect = function(index) {return this.correctAnswerIndex === index;};
    };

    var gameUI = {
        updateTimeRemaining: function(timeSeconds) {
            $("#time-remaining").text(timeSeconds);
        },

        updateQuestionScreen: function(question) {
            $("#question").text(question.question);
            $("#choice-a").text(question.getAnswer(0));
            $("#choice-b").text(question.getAnswer(1));
            $("#choice-c").text(question.getAnswer(2));
            $("#choice-d").text(question.getAnswer(3));
        },

        updateAnswerScreen: function(question, isCorrect) {
            $("#question-answer").text(question.question);
            if(isCorrect) {
                $("#is-correct").text("Correct!");
            }
            else {
                $("#is-correct").text("Oops! Incorrect");
            }
            $("#correct-response").text(question.getCorrectAnswer());
            $("#answer-image").attr("src", question.imagePath);
            //$("audio").attr("src", "question.audioPath");
        },

        updateResultScreen: function(correct, incorrect, unanswered) {
            $("#number-correct").text(correct);
            $("#number-incorrect").text(incorrect);
            $("#number-unanswered").text(unanswered);
        },

        showStartScreen: function() {
            $("#question-block").addClass("hidden");
            $("#answer-block").addClass("hidden");
            $("#results-block").addClass("hidden");
            $("#start-button").removeClass("hidden");
        },

        showQuestionScreen: function() {
            $("#start-button").addClass("hidden");
            $("#answer-block").addClass("hidden");
            $("#results-block").addClass("hidden");
            $("#question-block").removeClass("hidden");
        },

        showAnswerScreen: function() {
            $("#start-button").addClass("hidden");
            $("#question-block").addClass("hidden");
            $("#results-block").addClass("hidden");
            $("#answer-block").removeClass("hidden");
        },

        showResultScreen: function() {
            $("#start-button").addClass("hidden");
            $("#question-block").addClass("hidden");
            $("#answer-block").addClass("hidden");
            $("#results-block").removeClass("hidden");
        },

        playAudio: function() {
            $("audio").trigger("play");
        },

        stopAudio: function() {
            $("audio").trigger("pause");
        }
    };

    var game = {
        numberCorrect: 0,
        numberIncorrect: 0,
        numberSkipped: 0,
        questionTimeLimitSeconds: 30,
        timeBetweenQuestionsSeconds: 6,
        questionIndex: 0,
        secondsLeft: this.questionTimeLimitSeconds,

        timer: null,

        // Question(q, a0, a1, a2, a3, c, i, a)
        questions: [new Question("Which shark needs to continuously swim in order to breath?", "Bamboo Shark", "Tiger Shark", "Leopard Shark", "Nurse Shark", 1, "assets/images/tiger-shark.jpg", "../audio/"),
                    new Question("Which scuba cylinder valve holds a small reserve of air that is released by pulling a lever?", "J-valve", "H-valve", "K-valve", "Y-valve", 0, "assets/images/j-valve.jpg", "../audio/"),
                    new Question("What is the most important rule of scuba diving?", "Always dive with a buddy", "Keep my mask on while in the water, even at the surface", "Check my pressure gauge every couple of minutes", "Breathe continuously and never hold my breath", 3, "assets/images/lung-overinflation.png", "../audio/"),
                    new Question("Which of these is not a cetacean?", "Whale Shark", "Killer Whale", "Bottlenose Dolphin", "Blue Whale", 0, "assets/images/whale-shark.jpg", "../audio/"),
                    new Question("Which of these is an invertebrate?", "Bamboo Shark", "Lionfish", "Great Pacific Octopus", "Beluga Whale", 2, "assets/images/octopus.jpg", "../audio/"),
                    new Question("Which of these is poisonous?", "Lionfish", "Blue-ringed Octopus", "Portuguese Man o' War", "Porcupine Fish", 3, "assets/images/porcupine-fish.jpg", "../audio/"),
                    new Question("Which of these sea turtles grows to the largest size?", "Loggerhead", "Leatherback", "Green", "Hawksbill", 1, "assets/images/leatherback.jpg", "../audio/"),
                    new Question("What is the ambient pressure at 30m/100ft?", "1 Atmospheres", "2 Atmospheres", "3 Atmospheres", "4 Atmospheres", 3, "assets/images/pressure-vs-depth.png", "../audio/"),
                    new Question("Which of these not typically displayed on the main screen of a dive computer?", "Bottom Time", "Depth", "No Decompression Time", "Ambient Pressure", 3, "assets/images/dive-computer.png", "../audio/"),
                    new Question("Which of these parts of a regulator do you attach directly to the tank valve?", "First Stage", "Second Stage", "Alternate Air Source", "Submersible Pressure Gauge", 0, "assets/images/regulator.png", "../audio/")
        ],

        checkAnswer: function(answerIndex) {
            if (answerIndex === this.questions[this.questionIndex]) {
                this.numberCorrect++;
            }
            else if (answerIndex === null) {
                this.numberSkipped++;
            }
            else {
                this.numberIncorrect++;
            }
        },

        showQuestion: function() {
            gameUI.updateQuestionScreen(this.questions[this.questionIndex]);
            gameUI.showQuestionScreen();
        },

        showAnswer: function(answerIndex) {
            gameUI.updateAnswerScreen(this.questions[this.questionIndex],this.questions[this.questionIndex].isCorrect(answerIndex));
            gameUI.showAnswerScreen();
        },

        showResults: function() {
            gameUI.updateResultScreen(this.numberCorrect, this.numberIncorrect, this.numberSkipped);
            gameUI.showResultScreen();
        },

        endQuestionTimer: function() {
            clearInterval(this.timer);
        },

        startQuestionTimer: function() {
            this.secondsLeft = this.questionTimeLimitSeconds;
            gameUI.updateTimeRemaining(this.secondsLeft);
            var thisGame = this;
            this.timer = setInterval(function() {
                thisGame.secondsLeft--;
                if(thisGame.secondsLeft > 0) {
                    gameUI.updateTimeRemaining(thisGame.secondsLeft);
                }
                else {
                    clearInterval(thisGame.timer);
                    thisGame.numberSkipped++;
                    thisGame.showAnswer(null);
                    thisGame.startAnswerTimer();
                }
            }, 1000);
        },

        startAnswerTimer: function() {
            var thisGame = this;
            setTimeout(function(){
                thisGame.questionIndex++;
                if (thisGame.questionIndex < thisGame.questions.length) {
                    thisGame.showQuestion();
                    thisGame.startQuestionTimer();
                }
                else {
                    thisGame.showResults();
                }
            }, this.timeBetweenQuestionsSeconds*1000);
        },

        startGame: function() {
            this.numberSkipped = 0;
            this.numberIncorrect = 0;
            this.numberCorrect = 0;
            this.questionIndex = 0;

            //gameUI.stopAudio();
            this.showQuestion();
            this.startQuestionTimer();
        }
    };

    $("#start-button, #restart-button").click(function() {
        game.startGame();
    });

    $(".choice").click(function() {
        game.endQuestionTimer();
        game.checkAnswer(parseInt($(this).attr("value")));
        game.showAnswer(parseInt($(this).attr("value")));
        game.startAnswerTimer();
    });
});