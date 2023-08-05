import { test } from "@playwright/test";

import { checkForm, type ExpectedForm } from "./util.js";

test.describe("superValidateSync", () => {
  test("client-side", async ({ page }) => {
    await page.goto("/typebox-val-sync");
    await page.click("#client-side button");

    const initialForm: ExpectedForm = {
      name: {
        value: "Jane",
        errors: [],
      },
      nickname: {
        value: "",
        errors: [],
      },
      age: {
        value: "",
        errors: ["Must be a number >= 13"],
      },
      siblings: {
        value: "",
        errors: [],
      },
      email: {
        value: "",
        errors: ["string", "10", "pattern"],
      },
      agree: {
        value: false,
        errors: [],
      },
    };
    await checkForm(page, "#client-side", initialForm);
  });
});
