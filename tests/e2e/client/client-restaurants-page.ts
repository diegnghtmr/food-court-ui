import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base-page";

export class ClientDashboardPage extends BasePage {
  readonly viewMenuButton: Locator;
  
  constructor(page: Page) {
    super(page);
    this.viewMenuButton = page.getByRole("button", { name: "VER MENU" }).first();
  }

  async goto(): Promise<void> {
    await super.goto("/client/restaurants");
  }

  async viewFirstRestaurantMenu(): Promise<void> {
    await this.viewMenuButton.click();
  }
}
