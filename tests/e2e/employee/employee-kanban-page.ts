import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class EmployeeKanbanPage extends BasePage {
  readonly pendingColumn: Locator;
  readonly preparationColumn: Locator;
  readonly readyColumn: Locator;

  constructor(page: Page) {
    super(page);
    // Columns - Selector mas especifico: Buscar el div que contiene el titulo y luego su hermano (la lista)
    // O mejor, el contenedor padre que contiene el texto.
    // En OrdersKanban.tsx hay 3 columnas en un grid.
    
    // Usamos nth para identificar columnas por posicion (0=Pendiente, 1=Prep, 2=Listo)
    // Esto es mas seguro si la estructura es grid
    const columns = page.locator('.grid > div');
    this.pendingColumn = columns.nth(0);
    this.preparationColumn = columns.nth(1);
    this.readyColumn = columns.nth(2);
  }

  async goto(): Promise<void> {
    await super.goto("/employee/orders");
  }

  async verifyOrderVisible(orderId: string): Promise<void> {
    await expect(this.page.locator('.mb-4').filter({ hasText: `PEDIDO #${orderId}` }).first()).toBeVisible();
  }

  async moveOrderToPreparation(orderId: string): Promise<void> {
    const orderCard = this.pendingColumn.locator('.mb-4').filter({ hasText: `PEDIDO #${orderId}` });
    await orderCard.getByRole('button', { name: "TOMAR PEDIDO" }).click();
  }

  async verifyOrderInPreparation(orderId: string): Promise<void> {
    await expect(this.preparationColumn).toContainText(`PEDIDO #${orderId}`);
  }
}
