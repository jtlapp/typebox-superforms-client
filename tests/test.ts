import { expect, test } from "@playwright/test";

test.describe("superValidateSync", () => {
  test("client-side", async ({ page }) => {
    await page.goto("/typebox-val-sync");
    await page.click("#client-side button");
    await expect(page.locator("body")).toContainText("updated");

    expect(await page.inputValue("#client-side input[name=name]")).toEqual(
      "Jane"
    );
    await expect(page.locator("#client-side .name_errors")).toHaveCount(0);

    expect(await page.inputValue("#client-side input[name=nickname]")).toEqual(
      ""
    );
    await expect(page.locator("#client-side .nickname_errors")).toHaveCount(0);

    expect(await page.inputValue("#client-side input[name=age]")).toEqual("");
    await expect(page.locator("#client-side .age_errors")).toContainText(
      "Must be a number >= 13"
    );

    expect(await page.inputValue("#client-side input[name=siblings]")).toEqual(
      ""
    );
    await expect(page.locator("#client-side .siblings_errors")).toHaveCount(0);

    expect(await page.inputValue("#client-side input[name=email]")).toEqual("");
    await expect(page.locator("#client-side .email_errors")).toContainText(
      "string"
    );
    await expect(page.locator("#client-side .email_errors")).toContainText(
      "10"
    );
    await expect(page.locator("#client-side .email_errors")).toContainText(
      "pattern"
    );

    expect(await page.isChecked("#client-side input[name=agree]")).toEqual(
      false
    );
    await expect(page.locator("#client-side .agree_errors")).toHaveCount(0);
  });
});
