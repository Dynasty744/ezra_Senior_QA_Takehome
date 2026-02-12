import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly bookScanButton: Locator;
  readonly appointmentCard: Locator;

  constructor(page: Page) {
    super(page);
    this.bookScanButton = page.locator('.section-header').getByTestId('book-scan-btn');
    this.appointmentCard = page.locator('.card:has-text("MRI")');
  }

  async navigate() {
    await this.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async startBookingFlow() {
    await this.safeClick(this.bookScanButton);
    await this.waitForURL(/book-scan|select-plan/);
  }

  async verifyAppointmentExists(scanType?: string) {
    await this.waitForVisible(this.appointmentCard);
    if (scanType) {
      const text = await this.appointmentCard.first().textContent();
      expect(text?.toLowerCase()).toContain(scanType.toLowerCase());
    }
  }
}
