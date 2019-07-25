<script>
  import { navigateTo } from 'svero'
  import { username, hasKey } from '@stores';
  import { database } from '@config/firebase'
  import { osFilter, getImageSource, cutText, sorted } from './utils'
  
  const crowns = ['gold.png', 'silver.png', 'bronze.png']
  let temp = []
  $: participants = 0

   // get score data
  let usersRef = database.ref('scoreboard')
  usersRef.on('value', function(snapshot) {
    temp = []
    snapshot.forEach(function(childSnapshot) {
      let childData = childSnapshot.val()
      if(childData.score != undefined)
        temp = [...temp, childData]
    }) 

    // sorting high_score (priority : high_score, current_score)
    temp = sorted(temp)
    participants = temp.length
  })

  function playGame() {
    if (!$hasKey) {
      $username = prompt('Input your name : ') 
      if ($username) navigateTo('/quiz')
    } else {
      navigateTo('/quiz')
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  
  .container {
    background: #0b2d53;
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
  }

  .helmet-accesories > .helmet-title {
    color: white;
    padding: 5px 10px;
  }

  .accessories {
    font-size: 14px;
    padding: 5px 10px;
    color: #84aebf;
  }

  .accessories strong {
    color: #caecee;
  }

  .armour {
    overflow-x: scroll;
    margin-bottom: 25px;
  }

  .table {
    width: 100%;
    background: #0b2d53;
    color: white;
    border-collapse: collapse;
    margin-bottom: 20px;
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
    border-bottom: 3px solid #0b2d53;
  }

  .table tr.active {
    background-color: #2980b9;
  }
  
  .table tr.active small {
    color: #ecf0f1;
  }

  .table td {
    padding: 5px;
  }

  .table td:first-child {
    text-align: center;
    border-right: 3px solid #0b2d53;
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

  .shoes {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .btn-play {
    outline: none;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 20px;
    padding: 10px 15px;
    text-align: center;
    font-size: 20px;
    background-color: #107eeb;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
    /* width: calc(100% - 60px); */
    /* min-width: 50%; */
    margin: 0 auto;
    /* display: inline-block; */
    margin-bottom: 10px;
  }

 .crowns-container {
    display:flex; 
    align-items: center; 
    justify-content: center;
  }

  .crowns {
    margin-right: 5px;
    width: 20px;
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
    {#if temp.length >= 0}
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th colspan="2">Player</th>
            <th>Score Point</th>
          </tr>
        </thead>
        <tbody>
          {#if temp.length == 0}
            <tr>
              <td colspan="5">no participant(s)</td>
            </tr>
          {:else}
            {#each temp as t, idx}
              <tr class:active="{t.unique_id === $hasKey}" >
                <td>
                  <div class="crowns-container">
                    {#if (idx < 3) }
                      <img class="crowns" src="{getImageSource(crowns[idx])}" alt="crown"/>
                    {/if}
                    {idx+1}
                  </div>
                </td>
                <td class="text-center">{@html osFilter(t.user_agent != undefined ? t.user_agent : '-')}</td>
                <td>  
                  <div>{t.username}</div>
                  <small>{cutText(t.user_agent)}</small>
                </td>
                <td class="text-center">
                  <div class="bold">{t.score}</div>
                  <small>{t.time}</small>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
      <div class="shoes">
        {#if !$hasKey}
          <div class="btn-play" on:click={playGame}>Take Quiz</div>
        {:else}
          <div class="btn-play" on:click={playGame}>Take Quiz Again</div>
        {/if}
      </div>
    {:else}
      <p>Please wait a few seconds...</p>
    {/if}
  </div>
</div>