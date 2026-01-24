import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class OwnerDashboardPage extends BasePage {
  readonly dishesLink: Locator;
  readonly createDishButton: Locator;
  readonly manageDishesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dishesLink = page.getByRole("link", { name: "Mis Platos" });
    this.createDishButton = page.getByRole("button", { name: "Crear Nuevo Plato" });
    this.manageDishesButton = page.getByRole("button", { name: "Manage Dishes" });
  }

  async goto(): Promise<void> {
    await super.goto("/owner/dashboard");
  }

  async navigateToDishes(): Promise<void> {
    await this.dishesLink.click();
  }

  async verifyDishPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/owner\/dishes/);
    await expect(this.createDishButton).toBeVisible();
  }
}
