import { Page, Locator, FrameLocator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PaymentPage - Reserve appointment payment page
 */
export class PaymentPage extends BasePage {
  // Payment method selection
  readonly creditCardTab: Locator;

  // Credit card fields (Stripe)
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly cardZipInput: Locator;
  readonly cardholderNameInput: Locator;
  
  // Stripe iframe elements
  readonly stripeCardNumberFrame: FrameLocator;
  readonly stripeExpiryFrame: FrameLocator;
  readonly stripeCvcFrame: FrameLocator;
  
  // Payment button
  readonly continueButton: Locator;
  
  // Error messages
  readonly paymentError: Locator;
  readonly cardError: Locator;

  constructor(page: Page) {
    super(page);
    
    // Payment method tabs
    this.creditCardTab = page.locator(
      'button:has-text("card"), [data-value="card"], [data-testid="payment-credit-card"]'
    );

    // Credit card form fields (non-Stripe)
    this.cardNumberInput = page.locator(
      'input[name="cardNumber"], input[placeholder*="card number"], #card-number'
    );
    this.cardExpiryInput = page.locator(
      'input[name="cardExpiry"], input[placeholder*="MM"], input[placeholder*="expir"], #card-expiry'
    );
    this.cardCvcInput = page.locator(
      'input[name="cardCvc"], input[placeholder*="CVC"], input[placeholder*="CVV"], #card-cvc'
    );
    this.cardZipInput = page.locator(
      'input[name="billingZip"], input[placeholder*="ZIP"], input[placeholder*="postal"], #billing-zip'
    );
    this.cardholderNameInput = page.locator(
      'input[name="cardholderName"], input[placeholder*="name on card"], #cardholder-name'
    );
    
    // Stripe iframe locators
    this.stripeCardNumberFrame = page.frameLocator('iframe[name*="number"], iframe[id="payment-numberInput"]');
    this.stripeExpiryFrame = page.frameLocator('iframe[name*="expiry"], iframe[id="payment-expiryInput"]');
    this.stripeCvcFrame = page.frameLocator('iframe[name*="cvc"], iframe[id="payment-cvcInput"]');
    
    // Submit buttons
    this.continueButton = page.locator(
      'button:has-text("Continue"), [data-testid="continue-button"]'
    );
    
    // Error messages
    this.paymentError = page.locator(
      '.payment-error, [data-testid="payment-error"], [role="alert"]'
    );
    this.cardError = page.locator(
      '.card-error, .stripe-error, [data-testid="card-error"]'
    );
  }

  /**
   * Navigate to payment page
   */
  async navigate() {
    await this.goto('/book-scan/reserve-appointment');
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow Stripe to initialize
  }

  /**
   * Fill Stripe credit card information in embedded Payment Element
   */
  async fillStripeCardDetails(
    cardNumber: string,
    expiry: string = '12/29',
    cvc: string = '123'
  ) {
    // Wait for Stripe Payment Element to load
    await this.page.waitForTimeout(3000);
    
    try {
      // Stripe Payment Element uses a single iframe with all fields
      const stripeFrame = this.page.frameLocator('iframe[name*="privateStripe"]').first();
      
      // Fill card number
      const cardNumberInput = stripeFrame.locator('input[name="number"]');
      await cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
      await cardNumberInput.fill(cardNumber);
      
      // Fill expiry date
      const expiryInput = stripeFrame.locator('input[name="expiry"]');
      await expiryInput.fill(expiry.replace('/', '')); // Stripe wants "1225" not "12/25"
      
      // Fill CVC
      const cvcInput = stripeFrame.locator('input[name="cvc"]');
      await cvcInput.fill(cvc);
      
      // Fill ZIP code (visible in your snapshot)
      const zipInput = stripeFrame.locator('input[placeholder="12345"]');
      if (await this.isElementVisible(zipInput)) {
        await zipInput.fill('12345');
      }
      
      // Wait for validation to clear
      await this.page.waitForTimeout(1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Stripe Payment Element failed, error:', errorMessage);
      throw error; // Don't silently fail - payment is critical
    }
  }

  /**
   * Click continue after filling payment details
   */
  async clickContinue() {
    await this.safeClick(this.continueButton);
    // Wait for navigation to confirmation page
    await this.waitForURL(/scan-confirm/);
  }

  /**
   * Complete credit card payment with valid test card
   * @param cardNumber - Stripe test card number (default: valid card)
   */
  async completePayment(cardNumber = process.env.STRIPE_TEST_CARD || '4242424242424242') {
    await this.fillStripeCardDetails(cardNumber);
    await this.clickContinue();
  }

  /**
   * Complete payment with failed card
   * @param failureType - Type of failure ('declined' | 'insufficient_funds')
   */
  async completeFailedPayment(failureType: 'declined' | 'insufficient_funds' = 'declined') {
    const failedCards = {
      'declined': '4000000000000002',
      'insufficient_funds': '4000000000009995'
    };
    
    await this.fillStripeCardDetails(failedCards[failureType]);
  }

  /**
   * Verify payment error is displayed
   */
  async verifyPaymentError(expectedMessage?: string) {
    const errorLocator = await this.isElementVisible(this.paymentError) 
      ? this.paymentError 
      : this.cardError;
    
    await expect(errorLocator).toBeVisible({ timeout: 10000 });
    
    if (expectedMessage) {
      await expect(errorLocator).toContainText(expectedMessage, { ignoreCase: true });
    }
  }

  /**
   * Verify payment page security
   */
  async verifyPaymentSecurity() {
    // Check HTTPS
    await this.verifySecureConnection();
    
    // Verify no card data in URL
    this.verifySensitiveDataNotInURL(['card', 'cvv', 'cvc', 'expiry']);
    
    // Verify no card data in local storage
    await this.verifySensitiveDataNotInStorage(['card', 'cvv', 'cvc', 'creditcard']);
  }
}
