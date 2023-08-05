<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { toValidatorObject } from "$lib/index.js";

  import type { PageData } from "./$types.js";
  import { typeboxSchema } from "../schemas.js";
  import DemoForm from "../DemoForm.svelte";

  export let data: PageData;

  const {
    form: form1,
    errors: errors1,
    enhance: enhance1,
  } = superForm(data.form, {
    id: "typebox-client-side",
    validators: toValidatorObject(typeboxSchema),
  });
</script>

<h1>TypeBox: Client-Side Validation</h1>
<DemoForm form={form1} errors={errors1} enhance={enhance1} />
