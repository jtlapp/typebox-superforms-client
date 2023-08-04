<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from './$types';
	import { zodSchema } from '$lib/schemas';
	import DemoForm from '$lib/components/DemoForm.svelte';

	export let data: PageData;

	const {
		form: form1,
		errors: errors1,
		enhance: enhance1
	} = superForm(data.form, {
		id: 'zod-client-side',
		validators: zodSchema
	});

	const {
		form: form2,
		errors: errors2,
		enhance: enhance2
	} = superForm(data.form, { id: 'zod-server-side' });
</script>

<h1>Zod: Client-Side Validation</h1>
<DemoForm form={form1} errors={errors1} enhance={enhance1} />

<h1>Zod: Server-Side Validation</h1>
<DemoForm form={form2} errors={errors2} enhance={enhance2} />
