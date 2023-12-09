<script>
  import { enhance } from "$app/forms";

  export let data;
  export let form;
</script>

<svelte:head>
  <title>Captcha Test</title>
</svelte:head>

<div>What does this image say?</div>
{#if form?.success}
  <p>You are right!</p>
{:else if form?.error}
  <p class="error">{form?.error}</p>
{/if}
<img src={data.img} />
<form method="POST" use:enhance>
  <input hidden value={data.jwt} name="jwt" />
  <input placeholder="Answer" required name="answer" />
  <button>Submit</button>
</form>

<style>
  :global(body) {
    background-color: gray;
  }

  .error {
    color: red;
  }
</style>
