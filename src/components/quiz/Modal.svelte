<script>
  import { fade, fly } from 'svelte/transition'

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
    display: flex;
    padding: 0 0.5rem;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.5rem;
    border-bottom-right-radius: .3rem;
    border-bottom-left-radius: .3rem;
  }

  .icon-wrapper {
    margin: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-wrapper svg {
    width: 80px;
  }
  .modal-description {
    line-height: 1.5;
    font-size: 14px;
    color: rgba(14,30,37,.87);
  }
</style>

<div class='modal-background' transition:fade="{{duration: 500}}"></div>

<div class='modal' transition:fly="{{ y: 50, duration: 500 }}">
  <div class="modal-content">
    <div class="modal-header">
      <slot name='header'></slot>
    </div>
    <div class="modal-body">
      <div class="icon-wrapper">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="m21 5h20v20h-20z" fill="#ffd54f"/><path d="m51 20 6 10h-24l8-5v-15h16z" fill="#ffa001"/><path d="m41 25-8 5v-5z" fill="#bf360c"/><path d="m29 57h-3l-2-4h-3v-48a2 2 0 0 0 -4 0v48h-3l-2 4h-3l-2 4h24z" fill="#36474f"/></svg>
      </div>
      <p class="modal-description">
        <slot name="description"></slot>
      </p>
    </div>
    <div class="modal-footer">
      <slot name='action-button'></slot>
    </div>
  </div>
</div>
