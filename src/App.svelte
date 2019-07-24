<script>
  import { Router, Route } from 'svero'

  import Home from '@components/home/Home.svelte'
  import Reset from '@components/reset/Reset.svelte'
  import Quiz from '@components/quiz/Quiz.svelte'
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/quiz" component={Quiz} />
  <Route path="/reset" component={Reset} />
</Router>
