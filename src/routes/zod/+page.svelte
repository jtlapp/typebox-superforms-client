<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import type { PageData } from "./$types.js";
  import { zodSchema } from "../schemas.js";
  import TestForm from "$components/TestForm.svelte";

  export let data: PageData;

  const {
    form: form1,
    errors: errors1,
    enhance: enhance1,
  } = superForm(data.form, {
    id: "zod-client-side",
    validators: zodSchema,
  });

  const {
    form: form2,
    errors: errors2,
    enhance: enhance2,
  } = superForm(data.form, { id: "zod-server-side" });
</script>

<p>This page exists for reverse engineering purposes only.</p>

<h1>Zod: Client-Side Validation</h1>
<TestForm id="client-side" form={form1} errors={errors1} enhance={enhance1} />

<h1>Zod: Server-Side Validation</h1>
<TestForm id="server-side" form={form2} errors={errors2} enhance={enhance2} />
