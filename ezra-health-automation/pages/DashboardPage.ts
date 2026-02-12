import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly bookScanButton: Locator;
  readonly appointmentCard: Locator;

  constructor(page: Page) {
    super(page);
    this.bookScanButton = page.locator('.section-header').getByTestId('book-scan-btn');
    this.appointmentCard = page.locator('.card', { hasText: /MRI/ });
  }

  async navigate() {
    await this.page.waitForTimeout(2000);
    await this.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async startBookingFlow() {
    await this.safeClick(this.bookScanButton);
    await this.waitForURL(/book-scan|select-plan/);
  }

  async verifyAppointmentExists(scanType?: string) {
    const appointmentCard = this.appointmentCard.first();
    await this.waitForVisible(appointmentCard);

    if (scanType) {
      const text = await appointmentCard.textContent();
      expect(text?.toLowerCase()).toContain(scanType.toLowerCase());
    }
  }

  async verifyAppointmentNotExists(scanType?: string) {
    await this.page.waitForTimeout(2000);
    
    const appointmentLocator = scanType 
      ? this.page.locator(`.card:has-text("${scanType}")`)
      : this.appointmentCard;
    
    await expect(appointmentLocator).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Cancel the most recent appointment
   * @param scanType - Type of scan to cancel (e.g., 'MRI')
   */
  async cancelAppointment(scanType: string = 'MRI') {
  try {
    // Step 1: Navigate to dashboard if not already there
    await this.navigate();
    
    // Step 2: Check if appointment exists before attempting cancellation
    const appointmentCard = this.page.locator(`.card:has-text("${scanType}")`).first();
    const cancelButton = appointmentCard.locator('button:has-text("Reschedule or Cancel")');
    
    const isVisible = await this.isElementVisible(cancelButton);
    if (!isVisible) {
      console.log(`  No ${scanType} appointment found to cancel - skipping teardown`);
      return;
    }
    
    console.log(`  Found ${scanType} appointment - proceeding with cancellation...`);
    
    // Step 3: Click "Reschedule or Cancel" button
    await this.safeClick(cancelButton);
    
    // Step 4: Wait for navigation to schedule-actions page
    await this.page.waitForURL(/schedule-actions/, { timeout: 10000 });
    
    // Step 5: Click the "Cancel" button (not reschedule)
    const cancelCardButton = this.page.locator('button:has-text("Cancel")').filter({ hasText: /^Cancel$/ });
    await this.safeClick(cancelCardButton);
    
    // await this.page.waitForTimeout(1500);
    
    // Step 6: Click "Another reason"
    const otherReasonLabel = this.page.locator('label[for="OTHER"]');
    await this.safeClick(otherReasonLabel);
    
    // Step 7: Fill in the reason text field
    const reasonInput = this.page.locator('input[name="cancellationReasonExtraDescription"]');
    await this.waitForVisible(reasonInput);
    await this.safeFill(reasonInput, 'Automated test teardown');
    
    // Step 8: Click "Cancel Scan" button
    const cancelScanButton = this.page.locator('button.submit-btn:has-text("Cancel Scan")');
    await this.safeClick(cancelScanButton);
    
    // Step 9: Wait for cancellation to process
    await this.page.waitForTimeout(3000);
    
    // Step 10: Click "Back to Dashboard" button
    const backToDashboardButton = this.page.locator('button:has-text("Back to Dashboard")');
    await this.safeClick(backToDashboardButton);
    
    // Step 11: Wait for navigation back to dashboard
    await this.page.waitForURL('**/', { timeout: 10000 });
    
    console.log(`  Successfully cancelled ${scanType} appointment`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`  Warning: Failed to cancel appointment - ${errorMessage}`);
  }
}
}