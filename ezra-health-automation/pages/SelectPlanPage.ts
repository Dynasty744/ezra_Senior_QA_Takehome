import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SelectPlanPage - "Review Your Plan" page for scan selection
 */
export class SelectPlanPage extends BasePage {
  // Locators
  readonly mriScanOption: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Scan type options
    this.mriScanOption = page.locator(
      '[data-testid="FB30-encounter-card"], .encounter-list-item:has-text("MRI Scan")'
    );
    
    // Navigation
    this.continueButton = page.locator(
      '[data-testid="select-plan-submit-btn"], button:has-text("Continue")'
    );
  }

  /**
   * Navigate to select plan page
   */
  async navigate() {
    await this.goto('/book-scan/select-plan');
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await Promise.all([
      this.mriScanOption.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
    ]);
  }

  /**
   * Select a scan plan by type
   * @param scanType - Type of scan to select
   */
  async selectScanPlan(scanType: 'MRI') {
    const scanMap = {
      'MRI': this.mriScanOption,
    };
    
    const scanLocator = scanMap[scanType];
    
    if (await this.isElementVisible(scanLocator)) {
      await this.safeClick(scanLocator);
    } else {
      // Fallback: find scan by text
      const scanCard = this.page.locator(`.encounter-list-item:has-text("${scanType}"))`).first();
      await this.safeClick(scanCard);
    }
  }

  /**
   * Click continue to proceed to next step
   */
  async clickContinue() {
    await this.scrollIntoView(this.continueButton);
    await this.safeClick(this.continueButton);
    await this.waitForURL('/sign-up/select-plan/');
  }

  /**
   * Complete plan selection page
   * @param scanType - Type of scan
   */
  async completePlanSelection(
    scanType: 'MRI'
  ) {
    await this.selectScanPlan(scanType);
    await this.clickContinue();
  }
}
