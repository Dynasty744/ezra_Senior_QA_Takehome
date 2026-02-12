import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * QuestionnairePage - Medical questionnaire form
 */
export class QuestionnairePage extends BasePage {
  // Locators
  readonly questionnaireTitle: Locator;
  readonly questionnaireForm: Locator;
  readonly questions: Locator;
  readonly textInputs: Locator;
  readonly radioButtons: Locator;
  readonly checkboxes: Locator;
  readonly dropdowns: Locator;
  readonly textareas: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly submitButton: Locator;
  readonly completionMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.questionnaireTitle = page.locator(
      'h1:has-text("Medical"), h1:has-text("Questionnaire"), [data-testid="questionnaire-title"]'
    );
    this.questionnaireForm = page.locator(
      'form, [data-testid="questionnaire-form"], .questionnaire-form'
    );
    this.questions = page.locator(
      '.question, [data-testid*="question"], .form-group'
    );
    
    // Input types
    this.textInputs = page.locator('input[type="text"]');
    this.radioButtons = page.locator('input[type="radio"]');
    this.checkboxes = page.locator('input[type="checkbox"]');
    this.dropdowns = page.locator('select');
    this.textareas = page.locator('textarea');
    
    // Navigation buttons
    this.nextButton = page.locator(
      'button:has-text("Continue"), [data-testid="next-button"]'
    );
    this.previousButton = page.locator(
      'button:has-text("Back"), [data-testid="previous-button"]'
    );
    this.submitButton = page.locator(
      'button:has-text("Submit"), button[type="submit"], [data-testid="submit-button"]'
    );

    // Competion message
    this.completionMessage = page.getByRole(
      'heading', { name: 'Congratulations! You’re all set.' }
    );
  }

  /**
   * Navigate to questionnaire page
   * @param encounterId - Optional encounter ID for specific appointment
   */
  async navigate(encounterId?: string) {
    if (encounterId) {
      await this.goto(`/medical-questionnaire?flow=medical-questionnaire&direct=true&clearData=true&extraData={"encounterId":"${encounterId}"}`);
    } else {
      await this.goto('/medical-questionnaire?flow=medical-questionnaire&direct=true&clearData=true');
    }
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Allow form to initialize
  }

  /**
   * Check if questionnaire is accessible
   */
  async isQuestionnaireAccessible(): Promise<boolean> {
    return await this.isElementVisible(this.questionnaireForm);
  }

  /**
   * Fill a text input by label or placeholder
   * @param labelOrPlaceholder - Question label or input placeholder
   * @param value - Value to enter
   */
  async fillTextInput(labelOrPlaceholder: string, value: string) {
    const input = this.page.locator(
      `input[placeholder*="${labelOrPlaceholder}"], ` +
      `label:has-text("${labelOrPlaceholder}") ~ input, ` +
      `label:has-text("${labelOrPlaceholder}") + input`
    ).first();
    
    if (await this.isElementVisible(input)) {
      await this.safeFill(input, value);
    }
  }

  /**
   * Select a radio button option
   * @param questionText - Question text
   * @param optionText - Option to select
   */
  async selectRadioOption(questionText: string, optionText: string) {
    const radio = this.page.locator(
      `label:has-text("${questionText}") ~ label:has-text("${optionText}") input[type="radio"], ` +
      `text="${questionText}" >> .. >> label:has-text("${optionText}") input`
    ).first();
    
    if (await this.isElementVisible(radio)) {
      await this.safeClick(radio);
    }
  }

  /**
   * Fill textarea
   * @param labelText - Textarea label
   * @param text - Text to enter
   */
  async fillTextarea(labelText: string, text: string) {
    const textarea = this.page.locator(
      `label:has-text("${labelText}") ~ textarea, ` +
      `label:has-text("${labelText}") + textarea`
    ).first();
    
    if (await this.isElementVisible(textarea)) {
      await this.safeFill(textarea, text);
    }
  }

  /**
   * Click next button to proceed to next section
   */
  async clickNext() {
    if (await this.isElementVisible(this.nextButton)) {
      await this.scrollIntoView(this.nextButton);
      await this.safeClick(this.nextButton);
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Click previous button to go back
   */
  async clickPrevious() {
    if (await this.isElementVisible(this.previousButton)) {
      await this.safeClick(this.previousButton);
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Submit questionnaire
   */
  async submitQuestionnaire() {
    await this.scrollIntoView(this.submitButton);
    await this.safeClick(this.submitButton);
    
    // Wait for submission processing
    await this.page.waitForTimeout(3000);
  }

  /**
   * Complete questionnaire with sample data
   * This is a simplified version - in production, you'd have more detailed test data
   */
  async completeQuestionnaireWithSampleData() {
    // Wait for form to be ready
    await this.page.waitForTimeout(2000);
    
    // Fill any text inputs with generic answers
    const textFields = await this.textInputs.all();
    for (let i = 0; i < Math.min(textFields.length, 5); i++) {
      try {
        if (await textFields[i].isVisible()) {
          await textFields[i].fill('N/A');
        }
      } catch (e) {
        continue;
      }
    }
    
    // Select first option for any radio buttons
    const radioGroups = await this.page.locator('input[type="radio"]').all();
    const selectedGroups = new Set();
    
    for (const radio of radioGroups) {
      try {
        const name = await radio.getAttribute('name');
        if (name && !selectedGroups.has(name) && await radio.isVisible()) {
          await radio.click();
          selectedGroups.add(name);
        }
      } catch (e) {
        continue;
      }
    }
    
    // Click next if there are multiple pages
    let hasNextButton = await this.isElementVisible(this.nextButton);
    while (hasNextButton) {
      await this.clickNext();
      await this.page.waitForTimeout(1000);
      hasNextButton = await this.isElementVisible(this.nextButton);
    }
    
    // Submit
    await this.submitQuestionnaire();
  }

  /**
   * Verify questionnaire submission success
   */
  async verifySubmissionSuccess() {
    // Check for success message or redirect
    await expect(this.completionMessage).toBeVisible();
  }
}
