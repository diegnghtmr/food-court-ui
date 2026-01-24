import { test, expect } from "@playwright/test";
import { LoginPage } from "../auth/login-page";
import { OwnerCreateDishPage } from "./owner-create-dish-page";
import { OwnerDashboardPage } from "./owner-dashboard-page";

test.describe("Owner Workflow", () => {
  test("Owner can login and view dishes",
    { tag: ["@critical", "@e2e", "@owner", "@OWNER-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const ownerPage = new OwnerDashboardPage(page);

      await loginPage.goto();
      await loginPage.login({ 
        email: "owner@food.test", 
        password: "Owner123!" 
      });

      await loginPage.verifySuccess("/owner/dashboard");
      
      await ownerPage.navigateToDishes();
      await ownerPage.verifyDishPageLoaded();
    }
  );

  test("Owner can create a new dish",
    { tag: ["@critical", "@e2e", "@owner", "@OWNER-002"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const ownerPage = new OwnerDashboardPage(page);
      const createDishPage = new OwnerCreateDishPage(page);

      await loginPage.goto();
      await loginPage.login({ 
        email: "owner@food.test", 
        password: "Owner123!" 
      });

      await ownerPage.navigateToDishes();
      await ownerPage.createDishButton.click();
      
      await createDishPage.createDish({
        name: `Plato Test ${Date.now()}`,
        description: "Un plato delicioso creado por test",
        price: "25000",
        imageUrl: "https://picsum.photos/200/300",
        category: "Plato Fuerte" // Ensure this matches exactly one of the options
      });

      // Increase timeout just in case
      await expect(page).toHaveURL(/\/owner\/dishes/, { timeout: 10000 });
    }
  );
});
