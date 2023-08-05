import { test } from "@playwright/test";

import { waitForUpdate, checkForm, type ExpectedForm } from "./util.js";

test.describe("superValidateSync", () => {
  test.describe("client-side", () => {
    test("initial form behavior (w/ defaults)", async ({ page }) => {
      await page.goto("/typebox-val-sync/with-defaults");

      // Verify initial form.

      const initialForm: ExpectedForm = {
        name: {
          value: "Jane",
          errors: [],
        },
        nickname: {
          value: "Janey",
          errors: [],
        },
        age: {
          value: 50,
          errors: [],
        },
        siblings: {
          value: 0,
          errors: [],
        },
        email: {
          value: "username@example.com",
          errors: [],
        },
        agree: {
          value: true,
          errors: [],
        },
      };
      await checkForm(page, "#client-side", initialForm);

      // Verify submitting initial form (no errors).

      await page.click("#client-side button");
      await waitForUpdate(page);
      await checkForm(page, "#client-side", initialForm);
    });

    test("initial form behavior (w/out defaults)", async ({ page }) => {
      await page.goto("/typebox-val-sync");

      // Verify initial form.

      const initialForm: ExpectedForm = {
        name: {
          value: "",
          errors: [],
        },
        nickname: {
          value: "",
          errors: [],
        },
        age: {
          value: "",
          errors: [],
        },
        siblings: {
          value: "",
          errors: [],
        },
        email: {
          value: "",
          errors: [],
        },
        agree: {
          value: false,
          errors: [],
        },
      };
      await checkForm(page, "#client-side", initialForm);

      // Verify submitting initial form.

      await page.click("#client-side button");
      await waitForUpdate(page);
      await checkForm(page, "#client-side", {
        ...initialForm,
        name: {
          value: "",
          errors: ["length"],
        },
        age: {
          value: "",
          errors: ["Must be a number >= 13"],
        },
        email: {
          value: "",
          errors: ["string", "10", "pattern"],
        },
      });
    });
  });
});
