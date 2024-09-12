
let countSpan = document.querySelector('.count span');
let bulletSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let resultsContainer = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');



///////////// setting options

let currentIndex = 0;
let RightAnswers = 0;
let countdownInterval;







////////////////////////////////////////////////////////////////////////////////////////////////////////


function getQuestions(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){

            
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            ///////////////  create bullets + set questions count  ////////////////////////
            
            createBullets(qCount);


            ///////////////  add questons data  ////////////////////////

            addQuestionsData(questionsObject[currentIndex], qCount);


            ////// start countdown

            countdown(30,qCount);

            ///// click on submit button

            submitButton.onclick = function(){

                ///// get right answer 

                let theRightAnswer = questionsObject[currentIndex].right_answer;
                

                ////// increase index

                currentIndex++

                //// check the answer

                checkAnswer(theRightAnswer, qCount)

                ///// remove previous question 

                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                ///////////////  add questons data  ////////////////////////

                addQuestionsData(questionsObject[currentIndex], qCount);

                ///// handle bullets class

                handleBullets();

                /////// start countdown
                clearInterval(countdownInterval)
                countdown(30,qCount);


                ///////// show results 

                showResults(qCount);



            };


        }

    }

    myRequest.open("GET", "question.json", true);
    myRequest.send();

    


}

getQuestions()


//////////////////////////////////////////////////////////////////////////////////////


function createBullets(num){

    countSpan.innerHTML = num;


    ////////////////// create spans  ///////////////////////


    for (let i = 0 ; i < num ; i++){

        // create bullets
        let theBullets = document.createElement('span');

        ///check if its the first span

        if( i == 0){

            theBullets.classList.add('on')
        }
        
        //append bullets to main bullet container

        bulletSpanContainer.appendChild(theBullets);

        

    }

    

}



function addQuestionsData(obj,count){

    if(currentIndex < count){


        ////create h2 question title

let questonTitle = document.createElement('h2');

//// create question text 

let questionText = document.createTextNode(obj.title);

//// append text to h2

questonTitle.appendChild(questionText);

/// append h2 to quisArea

quizArea.appendChild(questonTitle);


///// add answers 

for ( let i = 1 ; i <= 4 ; i++ ){

    //// create main answer div

    let mainDiv = document.createElement('div');
    
    /////// add class to main div 

    mainDiv.classList.add('answer');


    ////// create radio input
    
    let radioInput = document.createElement('input');

    /// add type + name + id + data-attribute

    radioInput.name = 'question';
    radioInput.type = 'radio';
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];

    ///// make first option selected

   if( i === 1){

    radioInput.checked = true;
   }
    
    //////////// create label

    let theLabel = document.createElement('label');  

    //// add for attribute

    theLabel.htmlFor =  `answer_${i}`;

    /// create lable text 

    let theLabelText = document.createTextNode(obj[`answer_${i}`])
    
    ////// append the text to label

    theLabel.appendChild (theLabelText);

    /////// append radio input and label to main div

    mainDiv.appendChild(radioInput)
    mainDiv.appendChild(theLabel)

    /////// append all div to answersArea

    answersArea.appendChild(mainDiv)



    



}

    }




    
}



function checkAnswer(rAnswer,count){

    let answers = document.getElementsByName('question')
    let theChoosenAnswe;

    for (let i = 0; i < answers.length ; i++){

        if(answers[i].checked ){

        theChoosenAnswer = answers[i].dataset.answer

        }

        

    }

        
        if(rAnswer == theChoosenAnswer ){


            RightAnswers++
            
        }
}


function handleBullets() {



    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span,index) => {

        if (currentIndex === index){

            span.className = 'on';
        }


    })
}



function showResults(count) {
    let theResults;
    if (currentIndex === count){

        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (RightAnswers > count/2 && RightAnswers < count ){


            theResults = `<span class = 'good'>Good</span> , ${RightAnswers} from ${count}`
        }else if (RightAnswers=== count){

            theResults = `<span class = 'perfect'>Perfect</span> , ${RightAnswers} from ${count} `


        }else{

            theResults = `<span class = 'bad'>Bad</span> , ${RightAnswers} from ${count} `

        }

        resultsContainer.innerHTML = theResults;
        
    }


};


function countdown(duration, count){

    if (currentIndex < count){

        let minutes, seconds;

        countdownInterval = setInterval(function(){

            minutes = parseInt(duration/60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`

            if(--duration < 0){

                clearInterval(countdownInterval);
                submitButton.click();

            }

        },1000);

    }


}
