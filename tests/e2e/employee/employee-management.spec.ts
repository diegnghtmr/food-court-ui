import { test, expect } from "@playwright/test";
import { LoginPage } from "../auth/login-page";
import { EmployeeKanbanPage } from "./employee-kanban-page";
import { execSync } from "child_process";

test.describe("Employee Management", () => {
  const orderId = `999`; // Fixed ID for simplicity in mongo query

  test.beforeEach(() => {
    // Seed a PENDING order directly into DB
    // ID 999, Client 4, Restaurant 1
    const seedCommand = `docker exec -i order-mongodb mongosh orders_db --eval "db.orders.deleteOne({_id:'${orderId}'}); db.orders.insertOne({_id:'${orderId}',clientId:4,date:new Date(),status:'PENDIENTE',chefId:null,restaurantId:1,dishes:[{dish_id:1,quantity:1}],pin:null});"`;
    try {
        execSync(seedCommand);
    } catch (e) {
        console.error("Failed to seed DB:", e);
    }
  });

  test("Employee can take an order",
    { tag: ["@critical", "@e2e", "@employee", "@KANBAN-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const kanbanPage = new EmployeeKanbanPage(page);

      await loginPage.goto();
      await loginPage.login({ 
        email: "employee@food.test", 
        password: "Employee123!" 
      });

      // Verify order is visible in Pending
      // Wait for polling
      await expect(async () => {
        await kanbanPage.verifyOrderVisible(orderId);
      }).toPass({ timeout: 15000 });

      // Move to Preparation
      await kanbanPage.moveOrderToPreparation(orderId);
      await kanbanPage.verifyOrderInPreparation(orderId);
    }
  );
});
