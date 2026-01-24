import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class EmployeeOrdersPage extends BasePage {
  readonly pendingColumn: Locator;
  readonly preparationColumn: Locator;
  readonly readyColumn: Locator;

  constructor(page: Page) {
    super(page);
    this.pendingColumn = page.getByRole("heading", { name: /PENDIENTES/ });
    this.preparationColumn = page.getByRole("heading", { name: /EN PREPARACIÓN/ });
    this.readyColumn = page.getByRole("heading", { name: /LISTOS/ });
  }

  async goto(): Promise<void> {
    await super.goto("/employee/orders");
  }

  async verifyColumnsVisible(): Promise<void> {
    await expect(this.pendingColumn).toBeVisible();
    await expect(this.preparationColumn).toBeVisible();
    await expect(this.readyColumn).toBeVisible();
  }
}
