<script>
  import { database } from '@config/firebase.js'
  let token = ''
  let questionJSON = ''
  $: message = ''
  $: JSONmessage = ''
  function reset(){
    var ref = database.ref(`auth/admin`)
    ref.once('value')
    .then(function(snapshot) {
        let checkToken = token == snapshot.child('token').val()
        if(checkToken){
          database.ref('scoreboard').remove()
          message = 'Scoreboard has been reseted'
          token = ''
        }
        else{
          token = ''
          message = 'Whoops, wrong password'
        }
    });
  }

  
  function addQuestion(answer_1, answer_2, answer_3, answer_4, correct_answer, question) {
    let uniqueID = Math.random().toString(36).substring(7)
    database.ref('question/' + uniqueID).set({
      answer_1: answer_1,
      answer_2: answer_2,
      answer_3: answer_3,
      answer_4: answer_4,
      correct_answer: correct_answer,
      question: question,
      unique_id: uniqueID,
    }, function(error) {
      if (error)
        console.log(error)
      else {
        JSONmessage = 'Question data has been renewed'
        console.log('question data has been saved')
      }
    })
  }
  
  function handleQuestion () {
    database.ref('question/').remove()
    database.ref('scoreboard/').remove()
    let tempData = JSON.parse(questionJSON)
    tempData.question.forEach(function(value, index) {
      addQuestion(value.answer_1, value.answer_2, value.answer_3, value.answer_4, value.correct_answer, value.question)
    })
    questionJSON = ''
  }
</script>
<style>
  .container{
    font-family: 'Roboto';
    background: #0b2d53;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    color: white;
    flex-direction: column;
  }

  .flex{
    display: flex;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .custom-input{
    outline: none;
    border: 1px solid white;
    padding: 8px 10px;
    border-radius: 5px 0 0 5px;
  }

  .btn-reset{
    outline: none;
    background: #107eeb;
    color: white;
    text-decoration: none;
    border: 1px solid #107eeb;
    border-radius: 0 5px 5px 0;
    padding: 8px 10px;
  }

  .question-panel {
    width: calc(100% - 40px);
    padding: 0 20px;
  }

  textarea {
    width: calc(100% - 22px);
    max-width: calc(100% - 22px);
    min-width: calc(100% - 22px);
    min-height: 50vh;
    max-height: 80vh;
    outline: none;
    border: 1px solid white;
    padding: 8px 10px;
    border-radius: 5px;
    display: block;
  }

  .message{
    font-size: 12px;
  }

  .btn {
    background-color: #107eeb;
    color: white;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 10px 0;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
</style>
<div class="container">
    <h4>Input New Question</h4>
    <div class="question-panel">
      <textarea bind:value={questionJSON} placeholder="input raw json" cols="10"></textarea>
      <p class="message">{JSONmessage}</p>
      <button class="btn btn-question" class:disabled={questionJSON.length === 0} on:click={handleQuestion}>Add Question</button>
    </div>

    <h4>Reset Scoreboard</h4>
    <div class="flex">
      <input class="custom-input" bind:value={token} type="password" placeholder="TOKEN" />
      <button class="btn-reset" class:disabled={token.length === 0} on:click={reset}>RESET</button>
    </div>
    <p class="message">{message}</p>
</div>