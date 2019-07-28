<script>
  import { navigateTo } from 'svero'
  import { username, hasKey } from '@stores'
  import { database } from '@config/firebase'
  import { osFilter, getImageSource, cutText, sorted } from './utils'
  import { fade, fly } from 'svelte/transition'
  import Modal from './Modal.svelte'

  const UNIQUE_ID = localStorage.getItem('UNIQUE_ID')
  let hasUniqueID = UNIQUE_ID
  let hasUserName = localStorage.getItem('USERNAME')
  if(hasUniqueID == null) {
    let _uniqueID = Math.random().toString(36).substring(7)
    localStorage.setItem('UNIQUE_ID', _uniqueID)
  }

  let loadingStatus = 'Please wait a few seconds...'

  let showModal = false

  const crowns = ['gold.png', 'silver.png', 'bronze.png']
  let temp = []
  let tempName = ''
  let participants = 0
  let FirebaseActiveButton = true
  let FirebaseFreezeScoreboard = 0

  let takeQuizButtonConf = database.ref('app/take_quiz_button')
  takeQuizButtonConf.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      FirebaseActiveButton = childData
    }) 
  })

  let freezeScoreboardConf = database.ref('app/freeze_scoreboard')
  freezeScoreboardConf.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      FirebaseFreezeScoreboard = childData
    }) 
  })

  // get score data
  let hasTakenQuiz = false
  let usersRef = database.ref('scoreboard')
  usersRef.on('value', function(snapshot) {
    temp = []
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      if(childData.score != undefined && childData.time !== '-')
        temp = [...temp, childData]
      if (childData.unique_id === UNIQUE_ID) {
        hasTakenQuiz = true
        localStorage.removeItem('USERNAME')
      }
        

    })
    temp = sorted(temp)
    participants = temp.length
    loadingStatus = (participants == 0) ? 'no participant(s)' : 'Please wait a few seconds...'
  })

  function playGame() {
    if (hasUserName == null) {
      localStorage.setItem('USERNAME', tempName.trim())
      navigateTo('/quiz')
    } else {
      console.log('You has been take a quiz before.')
      // navigateTo('/quiz')
    }

  }

  function handleModal() {
    showModal = true
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  
  .container {
    background: #252c4a;
    min-height: 100vh;
    font-family: 'Roboto';
    color: white;
    overflow: hidden;
    padding: 15px;
  }

  .helmet {
    height: 40px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px 0;
    text-decoration: none;
    user-select: none;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .helmet-accesories {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .helmet-accesories > .helmet-title {
    color: white;
    font-size: 18px;
    padding: 5px 0;
  }

  .accessories {
    font-size: 14px;
    padding: 5px 0;
    color: #84aebf;
  }

  .accessories strong {
    color: #caecee;
  }

  .armour {
    overflow-x: scroll;
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .table {
    width: 100%;
    background: #252c4a;
    color: white;
    border-collapse: collapse;
    margin-bottom: 20px;
    user-select: none;
  }

  .table tbody {
    background-color: #0e3964;
  }

  .table th {
    background-color: transparent;
    text-transform: uppercase;
    color: #caecee;
    font-weight: bold;
    padding: 5px;
  }

  .table th:nth-child(2) {
    text-align: left;
  }

  .table tr {
    margin: 3px 0;
    border-bottom: 3px solid #252c4a;
  }

  .table tr.active {
    background-color: #2980b9;
  }
  
  .table tr.active small {
    color: #ecf0f1;
  }

  .table tr.active .time {
    background-color: #2c3e50;
  }

  .table td {
    padding: 5px;
  }

  .table td:first-child {
    text-align: center;
    border-right: 1px solid #252c4a;
  }

  .table td small {
    color: #84aebf;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  .text-center {
    text-align: center;
  }

  .bold {
    font-weight: bold;
  }

  .user-agent {
    font-size: 10px;
  }

  .score {
    font-size: 20px;
    padding: 5px 10px;
  }

  .time {
    color: white !important;
    padding: 2px 5px;
    border-radius: 3px;
    background-color: #2980b9;
  }

  .shoes {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .input {
    outline: none;
    border: none;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease-out;
    padding: 8px 1px;
    display: block;
    width: 100%;
    font-size: 14px;
    caret-color: #107eeb;
  }

  .input:focus {
    border-bottom: 1px solid #107eeb;
  }

  .btn-play {
    outline: none;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    padding: 7px 15px;
    text-align: center;
    font-size: 16px;
    background-color: #107eeb;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    margin: 0 auto;
    user-select: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

  .modal-slot-title {
    font-size: 14px;
    font-weight: normal;
    color: black;
  }

  .btn-play-modal {
    user-select: none;
    outline: none;
    color: white;
    background-color: #107eeb;
    display: inline-block;
    font-size: 12px;
    padding: 7px 15px;
    box-shadow: 0 2px 4px 0 rgba(14,30,37,.12);
    border: 1px solid #e9ebeb;
    border-bottom: 1px solid #e1e2e4;
    border-radius: 4px;
    transition: .2s ease;
  }

  .crowns-container {
    display:flex; 
    align-items: center; 
    justify-content: center;
  }

  .crowns {
    width: 25px;
  }

  @media only screen and (max-width: 360px) {
    .table {
      font-size: 12px;
    }
    .table th {
      font-size: 10px;
    }
    .table td small {
      font-size: 10px;
    }
    .crowns {
      width: 12px;
    }
  }
</style>

<div class="container">
  <div class="helmet">
    <div class="helmet-accesories">
      <label class="helmet-title">Townhall Quiz</label>
      <div class="accessories"><strong>{participants}</strong> participant(s)</div>
    </div>
  </div>
  <div class="armour">
    {#if FirebaseFreezeScoreboard}
      <p>scoreboard is freezed</p>
    {:else if temp.length > 0}
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th colspan="2">Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {#each temp as t, idx}
            <tr class:active="{t.unique_id === UNIQUE_ID}" transition:fade="{{duration: 500}}">
              <td>
                <div class="crowns-container">
                  {#if (idx < 3) }
                    <img class="crowns" src="{getImageSource(crowns[idx])}" alt="crown"/>
                  {:else}
                    {idx+1}
                  {/if}
                </div>
              </td>
              <td class="text-center">{@html osFilter(t.user_agent != undefined ? t.user_agent : '-')}</td>
              <td>  
                <div>{t.username}</div>
                <small class="user-agent">{cutText(t.user_agent)}</small>
              </td>
              <td class="text-center">
                <div class="score bold">{t.score}</div>
                <small class="time">{t.time}</small>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>{loadingStatus}</p>
    {/if}
    <div class="shoes">
      {#if !$hasKey}
        {#if hasUserName == null && hasTakenQuiz == false}
          <div class="btn-play" on:click="{() => handleModal()}" transition:fade="{{duration: 500}}">Join Quiz</div>
        {:else if (!hasTakenQuiz)}
          <div class="btn-play" on:click="{() => navigateTo('/quiz')}" transition:fade="{{duration: 500}}">Back to Lobby</div>
        {/if}
      {/if}
    </div>
    {#if FirebaseActiveButton}
      {#if showModal}
        <Modal on:close="{() => showModal = false}">
          <div class="modal-slot-title" slot="header">
            Input Name
          </div>
          <div class="definition-list">
            <input class="input" id="inputName" autocomplete="off" maxlength="50" bind:value={tempName} type="text">
          </div>
          <button class="btn-play-modal" slot="play-button" class:disabled={tempName.trim().length === 0} on:click={playGame}>Join</button>
        </Modal>
      {/if}
    {/if}
  </div>
</div>