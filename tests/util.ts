import { type Page, expect } from "@playwright/test";

export interface ExpectedInput {
  value: any;
  errors: string[];
}

export interface ExpectedForm {
  name: ExpectedInput;
  nickname: ExpectedInput;
  age: ExpectedInput;
  siblings: ExpectedInput;
  email: ExpectedInput;
  agree: ExpectedInput;
}

export async function waitForUpdate(page: Page) {
  await expect(page.locator("body")).toContainText("updated");
}

export async function checkForm(
  page: Page,
  formID: string,
  form: ExpectedForm
) {
  await checkField(page, formID, form, "name");
  await checkField(page, formID, form, "nickname");
  await checkField(page, formID, form, "age");
  await checkField(page, formID, form, "siblings");
  await checkField(page, formID, form, "email");
  await checkField(page, formID, form, "agree");
}

async function checkField(
  page: Page,
  formID: string,
  form: ExpectedForm,
  field: keyof ExpectedForm
) {
  const { value, errors } = form[field];

  if (typeof value === "boolean") {
    expect(await page.isChecked(`${formID} input[name=${field}]`)).toEqual(
      value
    );
  } else {
    expect(await page.inputValue(`${formID} input[name=${field}]`)).toEqual(
      value.toString()
    );
  }

  if (errors.length === 0) {
    await expect(page.locator(`${formID} .${field}_errors`)).toHaveCount(0);
  } else {
    for (const error of errors) {
      await expect(page.locator(`${formID} .${field}_errors`)).toContainText(
        error
      );
    }
  }
}

export async function setInputs(
  page: Page,
  formID: string,
  form: ExpectedForm
) {
  const setInput = async (field: keyof ExpectedForm) => {
    await page.fill(
      `${formID} input[name=${field}]`,
      form[field].value.toString()
    );
  };

  await setInput("name");
  await setInput("nickname");
  await setInput("age");
  await setInput("siblings");
  await setInput("email");
  if (form.agree.value) {
    await page.check(`${formID} input[name=agree]`);
  } else {
    await page.uncheck(`${formID} input[name=agree]`);
  }
}
