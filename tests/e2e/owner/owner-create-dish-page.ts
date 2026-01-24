import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base-page";

export class OwnerCreateDishPage extends BasePage {
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly imageUrlInput: Locator;
  readonly categorySelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByRole("textbox", { name: "Nombre del Plato" });
    this.descriptionInput = page.getByRole("textbox", { name: "Descripción" });
    this.priceInput = page.locator("input[type='number']");
    this.imageUrlInput = page.getByRole("textbox", { name: "URL de Imagen" });
    this.categorySelect = page.getByRole("combobox");
    this.submitButton = page.getByRole("button", { name: "Crear Plato" });
  }

  async goto(): Promise<void> {
    await super.goto("/owner/dish/create");
  }

  async createDish(data: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);
    await this.priceInput.fill(data.price);
    await this.imageUrlInput.fill(data.imageUrl);
    await this.categorySelect.selectOption({ label: data.category });
    await this.submitButton.click();
  }
}
