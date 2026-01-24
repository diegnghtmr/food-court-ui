import { test, expect } from "@playwright/test";
import { LoginPage } from "./login-page";

test.describe("Authentication", () => {
  test("Admin can login successfully",
    { tag: ["@critical", "@e2e", "@auth", "@AUTH-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login({ 
        email: "admin@food.test", 
        password: "Admin123!" 
      });

      await loginPage.verifySuccess("/admin/dashboard");
      await expect(page.getByRole("heading", { name: "Panel Admin" })).toBeVisible();
    }
  );
});
