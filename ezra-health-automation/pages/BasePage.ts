import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://myezra-staging.ezra.com';
  }

  async goto(path: string = '') {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForVisible(locator: Locator, timeout: number = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async safeClick(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.click();
  }

  async safeFill(locator: Locator, text: string) {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(text);
  }

  async waitForURL(pattern: string | RegExp) {
    await this.page.waitForURL(pattern, { timeout: 30000 });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  getCurrentURL(): string {
    return this.page.url();
  }

  async verifySecureConnection() {
    const url = this.getCurrentURL();
    expect(url).toContain('https://');
  }

  async scrollIntoView(locator: import('@playwright/test').Locator) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
  }

  async verifySensitiveDataNotInStorage(sensitiveKeys: string[]) {
    const localStorage = await this.page.evaluate(() => {
      return JSON.stringify(window.localStorage);
    });
    
    for (const key of sensitiveKeys) {
      expect(localStorage.toLowerCase()).not.toContain(key.toLowerCase());
    }
  }

  verifySensitiveDataNotInURL(sensitiveKeys: string[]) {
    const url = this.getCurrentURL();
    for (const key of sensitiveKeys) {
      expect(url.toLowerCase()).not.toContain(key.toLowerCase());
    }
  }
}
