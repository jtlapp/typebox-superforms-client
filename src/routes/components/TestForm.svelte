<script lang="ts">
  import type { superForm } from "sveltekit-superforms/client";

  export let id: string;
  export let form: ReturnType<typeof superForm>["form"];
  export let errors: ReturnType<typeof superForm>["errors"];
  export let enhance: ReturnType<typeof superForm>["enhance"];
</script>

<form {id} method="POST" use:enhance>
  <fieldset>
    <label for="name">Name</label>
    <input
      type="text"
      name="name"
      aria-invalid={$errors.name ? "true" : undefined}
      bind:value={$form.name}
    />
    {#if $errors.name}<span class="name_errors invalid">{$errors.name}</span
      >{/if}
  </fieldset>

  <fieldset>
    <label for="nickname">Nickname</label>
    <input
      type="text"
      name="nickname"
      aria-invalid={$errors.nickname ? "true" : undefined}
      bind:value={$form.nickname}
    />
    {#if $errors.nickname}<span class="nickname_errors invalid"
        >{$errors.nickname}</span
      >{/if}
  </fieldset>

  <fieldset>
    <label for="age">Age</label>
    <input
      type="number"
      name="age"
      aria-invalid={$errors.age ? "true" : undefined}
      bind:value={$form.age}
    />
    {#if $errors.age}<span class="age_errors invalid">{$errors.age}</span>{/if}
  </fieldset>

  <fieldset>
    <label for="siblings">Siblings</label>
    <input
      type="number"
      name="siblings"
      aria-invalid={$errors.siblings ? "true" : undefined}
      bind:value={$form.siblings}
    />
    {#if $errors.siblings}<span class="siblings_errors invalid"
        >{$errors.siblings}</span
      >{/if}
  </fieldset>

  <fieldset>
    <label for="email">E-mail</label>
    <input
      type="email"
      name="email"
      aria-invalid={$errors.email ? "true" : undefined}
      bind:value={$form.email}
    />
    {#if $errors.email}<span class="email_errors invalid">{$errors.email}</span
      >{/if}
  </fieldset>

  <fieldset>
    <label for="agree">Agree?</label>
    <input
      type="checkbox"
      name="agree"
      aria-invalid={$errors.agree ? "true" : undefined}
      bind:checked={$form.agree}
    />
    {#if $errors.agree}<span class="agree_errors invalid">{$errors.agree}</span
      >{/if}
  </fieldset>

  <div><button>Submit</button></div>
</form>

<style>
  fieldset {
    border: none;
  }
  .invalid {
    color: red;
  }
</style>
