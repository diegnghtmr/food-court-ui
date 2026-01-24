import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base-page";

export class ClientRestaurantPage extends BasePage {
  readonly addToCartButtons: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButtons = page.getByRole("button", { name: "AGREGAR +" });
    this.cartButton = page.getByRole("button", { name: /CARRITO/ });
  }

  async addDishToCart(index: number = 0): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async goToCart(): Promise<void> {
    await this.cartButton.click();
  }
}
