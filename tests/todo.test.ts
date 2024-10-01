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

test("can delete a todo", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  await page.getByPlaceholder("What needs to be done?").fill("Feed the cat");
  await page.getByPlaceholder("What needs to be done?").press("Enter");

  const todoList = page.locator('ul.todo-list');
  const todo = todoList.getByRole('listitem').filter({ hasText: "Feed the cat" });

  await expect(todo).toBeVisible();

  await todo.hover();
  // That "x" below is not a normal x but some kind of special symbol I copy-pasted
  // from the browser's html. Sometimes they work as part of getByText or a name
  // attribute like below. But sometimes they don't work and you'll have to figure
  // something else out.
  await todo.getByRole("button", { name: "×" }).click();

  await expect(todo).toBeHidden();
});

test("can complete a todo", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  await page.getByPlaceholder("What needs to be done?").fill("Feed the cat");
  await page.getByPlaceholder("What needs to be done?").press("Enter");

  const todoList = page.locator('ul.todo-list');
  const todo = todoList.getByRole('listitem').filter({ hasText: "Feed the cat" });

  await expect(todo).toBeVisible();

  const todoCheckbox = todo.getByRole("checkbox");
  await expect(todoCheckbox).not.toBeChecked();
  await todoCheckbox.click();

  await expect(todoCheckbox).toBeChecked();
});

test("can edit a todo", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  await page.getByPlaceholder("What needs to be done?").fill("Feed the cat");
  await page.getByPlaceholder("What needs to be done?").press("Enter");

  const todoList = page.locator('ul.todo-list');
  const todo = todoList.getByRole('listitem');

  await expect(todo).toBeVisible();

  await todo.dblclick();
  const todoInput = todo.getByRole("textbox");
  await todoInput.fill("Feed the dog");
  await todoInput.press("Enter");

  await expect(todo).not.toContainText("Feed the cat");
  // Using toContainText here instead of toHaveText is intentional.
  // When using "toHaveText" playwright adds up all the text inside the element and
  // compares it exactly to "Feed the dog". This would normally be okay, but the
  // problem is the todo doesn't just contain the string we gave it, but also a
  // hidden label "Edit Todo Input". This means when using "toHaveText" that
  // playwright will compare the expected value "Feed the dog" with the actual
  // value "Feed the dogEdit Todo Input" and fail because they aren't 100% equal.
  // So in this situation we use "toContainText" because it will pass since the
  // actual value "Feed the dogEdit Todo Input" does in fact contain the expected
  // value "Feed the dog".
  await expect(todo).toContainText("Feed the dog");
});

test("shows number of incomplete todos", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  const todoInput = page.getByPlaceholder("What needs to be done?");
  todoInput.fill("Feed the cat");
  todoInput.press("Enter");

  todoInput.fill("Feed the dog");
  todoInput.press("Enter");

  todoInput.fill("Feed the soul");
  todoInput.press("Enter");

  const todoList = page.locator('ul.todo-list');
  const allTodos = todoList.getByRole('listitem');
  const feedTheSoulTodo = allTodos.filter({ hasText: "Feed the soul" });
  await feedTheSoulTodo.getByRole("checkbox").click();

  await expect(allTodos).toHaveCount(3);
  await expect(page.getByText("2 items left")).toBeVisible();
});

test("hides all features except the todo text input when there are no todos", async ({ page }) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  const todoInput = page.getByPlaceholder("What needs to be done?");
  await todoInput.fill("Feed the cat");
  await todoInput.press("Enter");

  const todoList = page.locator('ul.todo-list');
  const todo = todoList.getByRole("listitem").filter({ hasText: "Feed the cat" });

  const todoCount = page.getByText(/[\d] items? left/);
  const allTodoFilter = page.getByRole('link').filter({ hasText: "All" });
  const activeTodoFilter = page.getByRole('link').filter({ hasText: "Active" });
  const completedTodoFilter = page.getByRole('link').filter({ hasText: "Completed" });
  const toggleAll = page.locator(".toggle-all");

  await expect(todoCount).toBeVisible();
  await expect(allTodoFilter).toBeVisible();
  await expect(activeTodoFilter).toBeVisible();
  await expect(completedTodoFilter).toBeVisible();
  await expect(toggleAll).toBeVisible();

  await todo.hover();
  await todo.getByRole("button", { name: "×" }).click();

  await expect(todoCount).toBeHidden();
  await expect(allTodoFilter).toBeHidden();
  await expect(activeTodoFilter).toBeHidden();
  await expect(completedTodoFilter).toBeHidden();
  await expect(toggleAll).toBeHidden();

  await expect(todoInput).toBeVisible();
});

test("shows a link back to the 'TodoMVC: Vue' webiste", async ({page}) => {
  await page.goto('https://todomvc.com/examples/vue/dist/#/');

  const todoMvcLink = page.locator("a[href='http://todomvc.com']");
  // const todoMvcLinks = page.getByRole("link", { name: "TodoMVC" });
  // const firstTodoMvcLink = todoMvcLinks.first();
  // await expect(firstTodoMvcLink).toBeVisible();
  // const allTodoMvcLinks = await todoMvcLinks.all();
  await expect(todoMvcLink).toBeVisible();
});
