import { test, expect } from '@playwright/test';

test("shows the site title 'TodoMVC: Vue'", async ({page}) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');
  await expect(page).toHaveTitle("TodoMVC: Vue");
});

test("can add a todo", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  await page.getByPlaceholder("What needs to be done?").fill("Feed the cat");
  await page.getByPlaceholder("What needs to be done?").press("Enter");

  const todoList = page.locator('ul.todo-list');
  const todo = todoList.getByRole('listitem').filter({ hasText: "Feed the cat" });

  await expect(todo).toBeVisible();
});

