<script>
  import { username, hasKey, lastKey } from '@stores';
  import { database } from '@config/firebase'

  let temp = []
  let totalQuestion = 5
  let usersRef = database.ref('question')
  let answerChecked = [false, false, false, false]
  let uniqueID = $lastKey == null ?  Math.random().toString(36).substring(7) : $lastKey
  lastKey.update(value => value = uniqueID)

  // check username is exists
  if($username == null){
    $username = prompt('Input your name : ')
    while($username == null || $username.length == 0){
      $username = prompt('Input your name : ')
    }
  }

  const MAX_SCORE = 100

  usersRef.on('value', function(snapshot) {
    temp = []
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      temp = [...temp, childData]
    }) 
    totalQuestion = temp.length
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
    if(currQuestion <= totalQuestion)
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
  }

  function writeScore(unique_id, name, score, user_agent, date) {
    hasKey.update(value => value = unique_id)
    database.ref('scoreboard/' + unique_id).set({
      username: name,
      score: score,
      user_agent: user_agent,
      submit_at: date,
      unique_id: unique_id,
    }, function(error) {
      if (error)
        console.log(error)
      else 
        console.log('data has been saved')
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
    writeScore(uniqueID, $username, score, navigator.userAgent, getDate())
    console.log('score : ', score)
  }

</script>
<style>
  .panel {
    background-color: white;
    border: 1px solid black;
    width: 100%;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
<h1>Quiz {currQuestion + 1}/{totalQuestion}</h1>
<div class="panel">
  {#if temp.length > 0}
    <div class="question-number">#{currQuestion+1}</div>
    <div class="question">{temp[currQuestion].question}</div>
    <div class="answer-list">
      <div class="answer-item">
        <label>
          <input type="radio" checked={answerChecked[0]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 1)} name="q-{currQuestion}-answer" />
          {temp[currQuestion].answer_1}
        </label>
      </div>
      <div class="answer-item">
        <label>
          <input type="radio" checked={answerChecked[1]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 2)} name="q-{currQuestion}-answer" />
          {temp[currQuestion].answer_2}
        </label>
      </div>
      <div class="answer-item">
        <label>
          <input type="radio" checked={answerChecked[2]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 3)} name="q-{currQuestion}-answer" />
          {temp[currQuestion].answer_3}
        </label>
      </div>
      <div class="answer-item">
        <label>
          <input type="radio" checked={answerChecked[3]} on:click={() => doAnswer(currQuestion, temp[currQuestion].unique_id, 4)} name="q-{currQuestion}-answer" />
          {temp[currQuestion].answer_4}
        </label>
      </div>
    </div>
  {:else}
    <div>Please wait...</div>
  {/if}
  <div class="button-group">
    <button class:disabled="{currQuestion === 0}" on:click={btnPrev}>Prev</button>
    <button class:disabled="{currQuestion === totalQuestion - 1}" on:click={btnNext}>Next</button>
    <button class:disabled="{currQuestion < totalQuestion - 1}" on:click={btnSubmit}>Submit</button>
  </div>
</div>