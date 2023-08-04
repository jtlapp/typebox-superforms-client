<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { toSuperformValidators } from 'typebox-superforms';

	import type { PageData } from './$types';
	import { typeboxSchema } from '$lib/typebox-schema';
	import DemoForm from '$lib/components/DemoForm.svelte';

	export let data: PageData;

	const {
		form: form1,
		errors: errors1,
		enhance: enhance1
	} = superForm(data.form, {
		id: 'typebox-client-side',
		validators: toSuperformValidators(typeboxSchema)
	});
</script>

<h1>TypeBox: Client-Side Validation</h1>
<DemoForm form={form1} errors={errors1} enhance={enhance1} />
