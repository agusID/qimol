<script>
  import { username, hasKey, lastKey } from '@stores';
  import { navigateTo } from 'svero'
  import { database } from '@config/firebase'

  let temp = []
  let totalQuestion = '?'
  let usersRef = database.ref('question')
  let answerChecked = [false, false, false, false]
  let activeSubmit = false
  let uniqueID = $lastKey == null ?  Math.random().toString(36).substring(7) : $lastKey
  lastKey.update(value => value = uniqueID)

  let milisec = 0
  let sec = 0;
  let min = 0
  let miliSecOut = 0
  let secOut = 0
  let minOut = 0
  let tick = 0
  
  // timer
  let x
  let startstop = 0

  // check username is exists
  // if($username == null){
  //   $username = prompt('Input your name : ')
  //   while($username == null || $username.length == 0){
  //     $username = prompt('Input your name : ')
  //   }
  // }

  const MAX_SCORE = 100

  usersRef.on('value', function(snapshot) {
    temp = []
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      temp = [...temp, childData]
    }) 
    totalQuestion = temp.length
    startStop()
  })
  
  let currQuestion = 0
  let userAnswer = []

  function unCheck(currQuestion){
    let checkboxes = new Array(); 
    checkboxes = document.getElementsByTagName('input')
    for (let i=0; i < checkboxes.length; i++)  {
      if (checkboxes[i].type == 'radio')   {
        checkboxes[i].checked = false
        answerChecked[i] = false
      }
    }

    let tempAnswerChecked = 0
    userAnswer.forEach(function(value, index){
      if(value.questin_no === currQuestion){
        tempAnswerChecked = value.answer - 1
        checkboxes[tempAnswerChecked].checked = true
        answerChecked[tempAnswerChecked] = true
      }
    })
    
  }

  function btnPrev() {
    currQuestion -= 1
    if(currQuestion <= 0)
      currQuestion = 0
    unCheck(currQuestion)
  }

  function btnNext() {
    currQuestion += 1
    if(currQuestion >= totalQuestion)
      currQuestion = totalQuestion - 1
    unCheck(currQuestion)
  }

  function doAnswer(no, id, answer) {
    let exists = false
    userAnswer.forEach(function(value, index){
      if(value.unique_id === id){
        userAnswer[index].answer = answer
        exists = true
        return
      }
    })
    if(exists == false)
      userAnswer.push({questin_no: no, unique_id: id, answer: answer})
    if(userAnswer.length === totalQuestion)
      activeSubmit = true
  }

  function writeScore(unique_id, name, score, user_agent, date, time) {
    hasKey.update(value => value = unique_id)
    database.ref('scoreboard/' + unique_id).set({
      username: name,
      score: score,
      user_agent: user_agent,
      submit_at: date,
      unique_id: unique_id,
      time: time,
    }, function(error) {
      if (error)
        console.log(error)
      else {
        navigateTo('/')
        console.log('data has been saved')
      }
        
    })
  }

  function getDate(){
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()

    today = mm + '/' + dd + '/' + yyyy
    return today
  }

  function btnSubmit() {
    let score = 0
    temp.forEach(function(value, index){
      if(value.correct_answer === userAnswer[index].answer)
        score += (MAX_SCORE / totalQuestion)
    })
    stop()
    let time = `${min}m ${sec}s`
    writeScore(uniqueID, $username, score, navigator.userAgent, tick, time)
  }

  function startStop() { /* Toggle StartStop */

    startstop = startstop + 1

    if (startstop === 1) {
      start()
    } else if (startstop === 2) {
      startstop = 0
      stop()
    }
  }


  function start() {
    x = setInterval(timer, 10)
  }

  function stop() {
    clearInterval(x);
  }

  function timer() {
    tick++
    miliSecOut = checkTime(milisec);
    secOut = checkTime(sec);
    minOut = checkTime(min);

    milisec = ++milisec;

    if (milisec === 100) {
      milisec = 0;
      sec = ++sec;
    }

    if (sec == 60) {
      min = ++min;
      sec = 0;
    }

    document.getElementById("milisec").innerHTML = miliSecOut
    document.getElementById("sec").innerHTML = secOut
    document.getElementById("min").innerHTML = minOut

  }

  function checkTime(i) {
    if (i < 10) 
      i = `0${i}`
    return i
  }

</script>
<style>
  .loader-container {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .loader {
    position: relative;
    width: 80px;
    height: 80px;
    display: inline-flex;
    background-color: transparent;
    border: 5px solid transparent;
    border-radius: 50%;
  }

  .loader:after {
    position: absolute;
    content: "";
    top: 0px;
    left: 0px;
    width: 80px;
    height: 80px;
    padding: 3px;
    border-width: 3px;
    border-style: solid;
    border-color: #107eeb transparent transparent transparent;
    border-radius: 50%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    animation: rotation .8s infinite ease-in-out;
    -webkit-animation: rotation .8s infinite ease-in-out;
  }

  .loader-label {
    margin-top: 50px;
    color: #ecf0f1;
  }

  @keyframes rotation {
    0% {
      transform: rotateZ(0deg);
      -webkit-transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
      -webkit-transform: rotateZ(360deg);
    }
  }

  @-webkit-keyframes rotation {
    0% {
      transform: rotateZ(0deg);
      -webkit-transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
      -webkit-transform: rotateZ(360deg);
    }
  }

  .container {
    background-color: #252c4a;
    height: 100vh;
    color: white;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Roboto';
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
  }

  .panel {
    background-color: #252c4a;
    width: 100%;
  }

  .question-indicator {
    margin: 20px 40px;
    color: #bdc3c7;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  .question-indicator strong{
    font-size: 20px;
  }

  .question-indicator-timer {
    border-radius: 20px;
    font-size: 18px;
    padding: 5px 10px;
    border: 2px solid #384060;
    background-color: white;
    color: #384060;
  }

  .question {
    margin: 20px 40px;
    font-weight: bold;
    font-size: 18px;
    min-height: 20vh;
    user-select: none;
    line-height: 1.5;
  }

  .answer-list {
    margin: 20px;
    margin-bottom: 100px;
  }

  .answer-item {
    margin: 15px;
    display: flex;
    align-items: center;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .btn-group {
    width: 100%;
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    padding: 10px;
    background-image: linear-gradient(rgb(37, 44, 74, 0.9), #252c4a);
  }

  .btn {
    background-color: #107eeb;
    color: white;
    border: none;
    outline: none;
    font-size: 20px;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 10px;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    user-select: none;
  }

  .btn-next, .btn-submit {
    min-width: 50%;
  }

  .btn-submit {
    display: none;
  }

  .btn-prev {
    background-color: white;
    color: black;
    border-radius: 50%;
    padding: 10px;
    margin-right: 0px;
    font-weight: bold;
    width: 41px;
  }

  .answer-label {
    display: block;
    user-select: none;
    line-height: 1.5;
  }
  
  svg {
    fill: none;
    stroke: white;
    stroke-width: 2px;
    visibility: visible;
    width: 20px;
    position: absolute;
    right: 10px;
    z-index: 99;
    top: 11px;
  }

  .not-visible {
    display: none;
  }

  .visible {
    display: inline-block;
  }

  [type="radio"]:checked,
  [type="radio"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="radio"]:checked + label,
  [type="radio"]:not(:checked) + label {
    position: relative;
    padding: 10px;
    padding-right: 40px;
    padding-left: 20px;
    cursor: pointer;
    display: block;
    width: 100%;
    border: 2px solid #224263;
    border-radius: 15px;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  [type="radio"]:not(:checked) + label {
    color: #bdc3c7;
  }

  [type="radio"]:checked + label {
    background-color:rgb(18, 125, 233, 0.2);
    color: white;
  }

  [type="radio"]:not(:checked)+ label > svg {
    visibility: hidden;
  }

  [type="radio"]:checked + label > svg {
    visibility: visible;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  [type="radio"]:checked + label:before,
  [type="radio"]:not(:checked) + label:before {
    content: '';
    position: absolute;
    right: 9px;
    top: 9px;
    width: 18px;
    height: 18px;
    border: 2px solid #224263;
    border-radius: 100%;
    background: transparent;
  }

  [type="radio"]:checked + label:after,
  [type="radio"]:not(:checked) + label:after {
    content: '';
    right: 9px;
    top: 9px;
    width: 18px;
    height: 18px;
    background: #107eeb;
    border: 2px solid #107eeb;
    position: absolute;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  [type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  [type="radio"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
</style>
<div class="container">
  <div class="panel">
    {#if temp.length > 0}
      <div class="question-indicator">
        <div class="question-indicator-label">
          <strong>Question {currQuestion + 1}</strong>/{totalQuestion}
        </div>
        <div class="question-indicator-timer">
          <div class="timer">
            <div>
              <span id="min">00</span> :
              <span id="sec">00</span> :
              <span id="milisec">00</span>
            </div>
          </div>
        </div>
      </div>
      <div class="question">{temp[currQuestion].question}</div>
      <div class="answer-list">
        <div class="answer-item">
          <input id="A" type="radio" checked={answerChecked[0]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 1)} name="q-{currQuestion}-answer" />
          <label class="answer-label" for="A">{temp[currQuestion].answer_1}
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </label>
        </div>
        <div class="answer-item">
          <input id="B" type="radio" checked={answerChecked[1]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 2)} name="q-{currQuestion}-answer" />
          <label class="answer-label" for="B">{temp[currQuestion].answer_2}
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </label>
        </div>
        <div class="answer-item">
          <input id="C" type="radio" checked={answerChecked[2]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 3)} name="q-{currQuestion}-answer" />
          <label class="answer-label" for="C">{temp[currQuestion].answer_3}
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </label>
        </div>
        <div class="answer-item">
          <input id="D" type="radio" checked={answerChecked[3]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 4)} name="q-{currQuestion}-answer" />
          <label class="answer-label" for="D">{temp[currQuestion].answer_4}
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </label>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn btn-prev" class:disabled="{currQuestion === 0}" on:click={btnPrev}>&LeftArrow;</button>
        <button class="btn btn-next" class:not-visible="{currQuestion === totalQuestion - 1}" on:click={btnNext}>Next</button>
        <button class="btn btn-submit" class:disabled={!activeSubmit} class:visible="{currQuestion >= totalQuestion - 1}" on:click={btnSubmit}>Submit</button>
      </div>
    {:else}
      <div class="loader-container">
        <div class="loader"></div>
        <div class="loader-label">Getting the Questions</div>
      </div>
    {/if}
  </div>
</div>