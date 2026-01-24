import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class ClientCartPage extends BasePage {
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmButton = page.getByRole("button", { name: "CONFIRMAR PEDIDO" });
  }

  async confirmOrder(): Promise<void> {
    await this.confirmButton.click();
  }

  async verifyOrderSuccess(): Promise<void> {
    // Wait for success message
    await expect(this.page.getByText("Pedido creado exitosamente!")).toBeVisible({ timeout: 15000 });
  }
}
