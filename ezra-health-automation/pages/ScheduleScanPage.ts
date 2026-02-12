import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ScheduleScanPage - Location and time selection page
 */
export class ScheduleScanPage extends BasePage {
  // Locators
  readonly locationCards: Locator;
  readonly locationCard: Locator;
  readonly calendar: Locator;
  readonly dateButton: Locator;
  readonly timeSlots: Locator;
  readonly timeSlot: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Location selection
    this.locationCards = page.locator(
      '.location-cards'
    );
    this.locationCard = page.locator(
      '.location-cards .location-card'
    ).first();
    
    // Calendar and time selection
    this.calendar = page.locator(
      '[data-testid="calendar"], .calendar, [role="grid"]'
    );
    this.dateButton = page.locator(
      '.vuecal__cell .vc-day-content[role="button"]'
    );
    this.timeSlots = page.locator(
      '[data-testid="time-slots"], .appointments__list, .available-times'
    );
    this.timeSlot = page.locator(
      '.appointments__individual-appointment:visible'
    ).first();
    
    // Navigation
    this.continueButton = page.locator(
      '[data-test="submit"]'
    );
  }

  /**
   * Navigate to schedule scan page
   */
  async navigate() {
    await this.goto('/book-scan/schedule-scan');
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow dynamic content to load
  }

  /**
   * Select first available location
   */
  async selectFirstLocation() {
    await this.waitForVisible(this.locationCard);
    await this.safeClick(this.locationCard);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get available future dates from calendar
   */
  private async getAvailableDates(): Promise<Locator[]> {
    const dateButtons = await this.dateButton.all();
    const availableDates: Locator[] = [];
    
    for (const dateBtn of dateButtons) {
    // Find the parent cell to check for disabled state
    const cell = dateBtn.locator('xpath=../..'); // Go up to vuecal__cell
    const classAttribute = await cell.getAttribute('class');
    
    // Check if date is NOT disabled and NOT before min
    if (!classAttribute?.includes('--disabled') && 
        !classAttribute?.includes('--before-min') &&
        !classAttribute?.includes('--out-of-scope')) {
      availableDates.push(dateBtn);
    }
  }
    
    return availableDates;
  }

  /**
   * Select first available date from calendar
   */
  async selectFirstAvailableDate() {
  await this.waitForVisible(this.calendar);
  
  // Directly select the first cell without disabled classes
  const firstAvailableDate = this.page.locator(
    '.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--before-min):not(.vuecal__cell--out-of-scope) .vc-day-content[role="button"]'
  ).first();
  
  await firstAvailableDate.waitFor({ state: 'visible', timeout: 5000 });
  await firstAvailableDate.click();
  await this.page.waitForTimeout(1000);
}

  /**
   * Select first available time slot
   */
  async selectFirstAvailableTimeSlot() {
    await this.waitForVisible(this.timeSlot);
    await this.safeClick(this.timeSlot.first());
    await this.page.waitForTimeout(500);
  }

  /**
   * Click continue to proceed to payment
   */
  async clickContinue() {
    await this.scrollIntoView(this.continueButton);
    await this.safeClick(this.continueButton);
    await this.waitForURL(/reserve-appointment/);
  }

  /**
   * Complete schedule selection
   */
  async completeScheduleSelection() {
    await this.selectFirstLocation();
    await this.selectFirstAvailableDate();
    await this.selectFirstAvailableTimeSlot();
    await this.clickContinue();
  }
}
