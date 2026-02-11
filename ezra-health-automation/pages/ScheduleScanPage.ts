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
      '[data-testid="location-cards"], .location-cards,'
    );
    this.locationCard = this.locationCards.first();
    
    // Calendar and time selection
    this.calendar = page.locator(
      '[data-testid="calendar"], .calendar, [role="grid"]'
    );
    this.dateButton = page.locator(
      '[data-testid*="date"], .vuecal__cell vuecal__cell--day1, button[aria-label*="day"]'
    );
    this.timeSlots = page.locator(
      '[data-testid="time-slots"], .appointments__list, .available-times'
    );
    this.timeSlot = page.locator(
      '[data-testid*="time-slot"], .appointments__individual-appointment, button[aria-label*="time"]'
    );
    
    // Navigation
    this.continueButton = page.locator(
      'button:has-text("Continue"), button[type="submit"], [data-test="submit"]'
    );
  }

  /**
   * Navigate to schedule scan page
   */
  async navigate() {
    await this.goto('/sign-up/schedule-scan');
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
      const isDisabled = await dateBtn.getAttribute('disabled');
      const hasDisabledClass = await dateBtn.getAttribute('class');
      
      if (!isDisabled && !hasDisabledClass?.includes('disabled')) {
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
    
    const availableDates = await this.getAvailableDates();
    
    if (availableDates.length > 0) {
      await availableDates[0].click();
    } else {
      // Fallback: click first non-disabled date button
      await this.dateButton.first().click();
    }
    
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
    await this.waitForURL('/sign-up/reserve-appointment/');
  }

  /**
   * Complete schedule selection
   */
  async completeScheduleSelection() {
    await this.clickContinue();
  }

    /**
   * Scroll an element into view
   * @param locator - Playwright Locator to scroll
   */
  async scrollIntoView(locator: import('@playwright/test').Locator) {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
  }
}
