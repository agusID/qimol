<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
	}

	.modal {
		position: fixed;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: hidden;
		transform: translate(-50%,-50%);
		border-radius: 0.2em;
		background: white;
    color: black;
	}

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 8px;
    outline: 0;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
  }

  .modal-body {
    position: relative;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0 0.5rem;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    border-bottom-right-radius: .3rem;
    border-bottom-left-radius: .3rem;
  }

  .btn-close {
    user-select: none;
    outline: none;
    color: rgba(14,30,37,.87);
    background-color: transparent;
    margin-left: .25rem;
    display: inline-block;
    padding: 7px 15px;
    font-size: 12px;
    box-shadow: 0 2px 4px 0 rgba(14,30,37,.12);
    border: 1px solid #e9ebeb;
    border-bottom: 1px solid #e1e2e4;
    border-radius: 4px;
    transition: .2s ease;
  }

</style>

<div class='modal-background' on:click='{() => dispatch("close")}'></div>

<div class='modal'>
  <div class="modal-content">
    <div class="modal-header">
      <slot name='header'></slot>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
    <div class="modal-footer">
      <slot name='play-button'></slot>
      <button class="btn-close" on:click='{() => dispatch("close")}'>Cancel</button>
    </div>
  </div>
</div>
