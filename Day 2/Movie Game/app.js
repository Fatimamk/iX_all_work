
let questionno = 0;
let data = [
    {question:"This movie is about a dude with a stick...", answer:"Harry Potter", hint:"It's Magic..."},
    {question:"This movie is about a rectangle...", answer:"Spongebob Squarepants", hint:"It's a cartoon.."},
    {question:"In this movie, cars go fast..", answer:"Cars", hint:"Kachow"},
]; 

// Listen for submit guess
document.getElementById("game-guess").addEventListener('click', function(e){
   e.preventDefault()
   setTimeout(checkAns, 2000);
   
})
// Listen for submit hint 
document.getElementById("hint-in").addEventListener('click', function(e){
    e.preventDefault()
    console.log("d");
    setTimeout(showHint, 2000);
    
 })

// Check Answer
function checkAns(){
    let guess = document.getElementById('guess-input').value;
    //let answer =  document.getElementById('answer').value;
    //let hint =  document.getElementById('hint').value;
    let question =  document.getElementById('question');

    //console.log(guess, answer, hint, questionno, data[questionno].question);
    console.log(data[questionno].answer, guess, questionno);
    
    if(guess == data[questionno].answer && questionno <= 2){
        console.log("good");
        document.getElementById('answer').style.display ="block";
        document.getElementById('answer').value ="Correct!";
        document.getElementById('answer').style.backgroundColor = "#f0ffed";

        questionno++;
        document.getElementById('hint').value = "";
        
        if (questionno <= 2){
            question.textContent = data[questionno].question;  
            console.log(data[questionno].answer, questionno);
        }
        else{
            questionno = 0;
            question.textContent = data[questionno].question;  
        }
    }
    else if(questionno <= 2){
        console.log("bad");
        console.log(data[questionno].answer, questionno);
        document.getElementById('answer').style.display ="block";
        document.getElementById('answer').value ="Try Again :/";
        document.getElementById('answer').style.backgroundColor = "#ffedee";
    }
}

// Show Hint 
function showHint(){
    //console.log(document.getElementById('hint').value, data);
    document.getElementById('hint').value = data[questionno].hint;
}
