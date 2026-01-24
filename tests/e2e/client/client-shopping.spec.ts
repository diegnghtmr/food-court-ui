import { test, expect } from "@playwright/test";
import { LoginPage } from "../auth/login-page";
import { ClientRestaurantPage } from "./client-restaurant-page";

test.describe("Client Shopping", () => {
  test("Client can add items to cart",
    { tag: ["@critical", "@e2e", "@client", "@SHOPPING-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const restaurantPage = new ClientRestaurantPage(page);
      
      await loginPage.goto();
      await loginPage.login({ email: "client@food.test", password: "Client123!" });
      
      // Select Restaurant
      await page.getByRole("button", { name: "VER MENU" }).first().click();
      await expect(page.getByText("ENTRADA")).toBeVisible({ timeout: 15000 });

      // Add Dish
      await restaurantPage.addDishToCart(0);
      
      // Verify success toast
      await expect(page.getByText("agregado al carrito")).toBeVisible();

      // Go to Cart
      await restaurantPage.goToCart();
      await expect(page).toHaveURL("/client/cart");
      
      // Verify item in cart
      await expect(page.getByText("Subtotal")).toBeVisible();
      await expect(page.getByRole("button", { name: "CONFIRMAR PEDIDO" })).toBeVisible();
    }
  );
});
