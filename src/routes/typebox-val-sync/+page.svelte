<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { toValidatorObject } from "$lib/index.js";

  import type { PageData } from "../typebox/$types.js";
  import { typeboxSchema } from "../schemas.js";
  import TestForm from "$components/TestForm.svelte";

  export let data: PageData;

  let updated = false;

  const {
    form: form1,
    errors: errors1,
    enhance: enhance1,
  } = superForm(data.form, {
    id: "typebox-client-side",
    validators: toValidatorObject(typeboxSchema),
    onUpdated: () => {
      updated = true;
    },
  });
</script>

<h1>TypeBox: Client-Side Validation</h1>
<TestForm id="client-side" form={form1} errors={errors1} enhance={enhance1} />

{#if updated}
  <p><b>updated</b></p>
{/if}
