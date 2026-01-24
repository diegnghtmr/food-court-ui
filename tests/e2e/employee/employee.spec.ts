import { test } from "@playwright/test";
import { LoginPage } from "../auth/login-page";
import { EmployeeOrdersPage } from "./employee-orders-page";

test.describe("Employee Workflow", () => {
  test("Employee can login and view order board",
    { tag: ["@critical", "@e2e", "@employee", "@EMPLOYEE-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const employeePage = new EmployeeOrdersPage(page);

      await loginPage.goto();
      await loginPage.login({ 
        email: "employee@food.test", 
        password: "Employee123!" 
      });

      await loginPage.verifySuccess("/employee/orders");
      await employeePage.verifyColumnsVisible();
    }
  );
});
