import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"], #email');
    this.passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Log in")');
  }

  async navigate() {
    await this.goto('/sign-in');
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
  }

  async login(email: string, password: string) {
    await this.safeFill(this.emailInput, email);
    await this.safeFill(this.passwordInput, password);
    await this.safeClick(this.loginButton);
  }

  async loginWithTestUser() {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      throw new Error('Test user credentials are not set in environment variables.');
    }
    await this.login(email, password);
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL(/\/(dashboard|home|$)/, { timeout: 30000 });
    const url = this.getCurrentURL();
    expect(url).not.toContain('sign-in');
  }
}
