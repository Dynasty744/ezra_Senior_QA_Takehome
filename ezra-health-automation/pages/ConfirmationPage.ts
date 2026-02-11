import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ConfirmationPage - Scan confirmation page after payment
 */
export class ConfirmationPage extends BasePage {
  // Locators
  readonly appointmentDetails: Locator;
  readonly scanType: Locator;
  readonly appointmentDateTime: Locator;
  readonly locationName: Locator;
  readonly fillQuestionnaireButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Appointment details
    this.appointmentDetails = page.locator(
      '[data-testid="scan-confirm__details-container"], .scan-confirm__details-container'
    );
    this.scanType = page.locator(
      '[data-testid="scan-details"], .scan-details'
    );
    this.appointmentDateTime = page.locator(
      '[data-testid="appointment-date"], .scan-details__row:has-text("Date") .b2'
    );
    this.locationName = page.locator(
      '[data-testid="location-name"], .scan-details__row:has-text("Location") .b2'
    );
    
    // Action buttons
    this.fillQuestionnaireButton = page.locator(
      'button:has-text("Begin Medical Questionnaire"), [data-testid="questionnaire"]'
    );
  }

  /**
   * Navigate to confirmation page
   */
  async navigate() {
    await this.goto('/sign-up/scan-confirm');
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.appointmentDetails.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Verify confirmation page is displayed
   */
  async verifyConfirmationDisplayed() {
    await expect(this.appointmentDetails).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify appointment details
   * @param expectedDetails - Object with expected values
   */
  async verifyAppointmentDetails(expectedDetails?: {
    scanType?: string;
    date?: string;
    location?: string;
  }) {
    await expect(this.appointmentDetails).toBeVisible();
    
    if (expectedDetails?.scanType) {
      const detailsText = await this.appointmentDetails.textContent();
      expect(detailsText?.toLowerCase()).toContain(expectedDetails.scanType.toLowerCase());
    }
    
    if (expectedDetails?.date) {
      const detailsText = await this.appointmentDetails.textContent();
      expect(detailsText).toContain(expectedDetails.date);
    }
    
    if (expectedDetails?.location) {
      const detailsText = await this.appointmentDetails.textContent();
      expect(detailsText?.toLowerCase()).toContain(expectedDetails.location.toLowerCase());
    }
  }

  /**
   * Click "Fill out medical questionnaire" button
   */
  async clickFillQuestionnaire() {
    await this.scrollIntoView(this.fillQuestionnaireButton);
    await this.safeClick(this.fillQuestionnaireButton);
    await this.waitForURL(/medical-questionnaire/);
  }

  /**
   * Verify questionnaire button is visible
   */
  async verifyQuestionnaireButtonVisible() {
    await expect(this.fillQuestionnaireButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get scan type from confirmation
   */
  async getScanType(): Promise<string | null> {
    if (await this.isElementVisible(this.scanType)) {
      return await this.scanType.textContent();
    }
    
    // Fallback: try to extract from details
    const detailsText = await this.appointmentDetails.textContent();
    const scanMatch = detailsText?.match(/(MRI|CT|Heart|Lung)\s+Scan/i);
    return scanMatch ? scanMatch[1] : null;
  }

  /**
   * Get appointment date
   */
  async getAppointmentDate(): Promise<string | null> {
    if (await this.isElementVisible(this.appointmentDateTime)) {
      return await this.appointmentDateTime.textContent();
    }
    return null;
  }

  /**
   * Get location name
   */
  async getLocationName(): Promise<string | null> {
    if (await this.isElementVisible(this.locationName)) {
      return await this.locationName.textContent();
    }
    return null;
  }

  /**
   * Verify all essential confirmation elements are present
   */
  async verifyCompleteConfirmation() {
    await this.verifyConfirmationDisplayed();
    await expect(this.appointmentDetails).toBeVisible();
    await expect(this.fillQuestionnaireButton).toBeVisible();
  }

  /**
   * Scroll an element into view
   * @param locator - Playwright Locator to scroll
   */
  async scrollIntoView(locator: import('@playwright/test').Locator) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
  }
}
