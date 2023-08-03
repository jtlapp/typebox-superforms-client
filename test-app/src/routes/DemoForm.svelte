<script lang="ts">
	import type { superForm } from 'sveltekit-superforms/client';

	export let form: ReturnType<typeof superForm>['form'];
	export let errors: ReturnType<typeof superForm>['errors'];
	export let enhance: ReturnType<typeof superForm>['enhance'];
</script>

<form method="POST" use:enhance>
	<fieldset>
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
		/>
		{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
	</fieldset>

	<fieldset>
		<label for="email">E-mail</label>
		<input
			type="email"
			name="email"
			aria-invalid={$errors.email ? 'true' : undefined}
			bind:value={$form.email}
		/>
		{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
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
