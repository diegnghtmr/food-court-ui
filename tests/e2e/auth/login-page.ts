import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export interface LoginData {
  email: string;
  password: string;
}

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Correo Electrónico" });
    this.passwordInput = page.getByRole("textbox", { name: "Contraseña" });
    // Use locator('form') to distinguish from the header login button
    this.submitButton = page.locator("form").getByRole("button", { name: "Iniciar Sesión" });
  }

  async goto(): Promise<void> {
    await super.goto("/login");
  }

  async login(data: LoginData): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.submitButton.click();
  }

  async verifySuccess(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }
}
