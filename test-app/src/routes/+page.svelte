<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from './$types';
	import { demoSchema } from '$lib/schema';
	import DemoForm from './DemoForm.svelte';

	export let data: PageData;

	const {
		form: form1,
		errors: errors1,
		enhance: enhance1
	} = superForm(data.form, { id: 'server-side' });

	const {
		form: form2,
		errors: errors2,
		enhance: enhance2
	} = superForm(data.form, {
		id: 'client-side',
		validators: demoSchema
	});
</script>

<h1>Server-Side Validation</h1>
<DemoForm form={form1} errors={errors1} enhance={enhance1} />

<h1>Client-Side Validation</h1>
<DemoForm form={form2} errors={errors2} enhance={enhance2} />
