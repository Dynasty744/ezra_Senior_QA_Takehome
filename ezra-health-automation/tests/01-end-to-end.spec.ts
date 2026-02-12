import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SelectPlanPage } from '../pages/SelectPlanPage';
import { ScheduleScanPage } from '../pages/ScheduleScanPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

test.describe('End-to-End Booking Flow', () => {
  let dashboardPage: DashboardPage;
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.loginWithTestUser();
    
    try {
      await dashboardPage.verifyAppointmentExists('MRI');
      console.log('  Appointment found - proceeding with cancellation');
      await dashboardPage.cancelAppointment('MRI');
    } catch (error) {
      console.log('  No existing MRI appointment found - skipping cancellation');
    }
  });

  test.afterEach(async ({ }, testInfo) => {
    // Conditional teardown: Only run if appointment was likely created
    const shouldCleanup = 
      testInfo.status === 'passed' || 
      (testInfo.status === 'failed' && testInfo.errors.some(e => 
        e.message?.includes('confirmation') || 
        e.message?.includes('dashboard') ||
        e.message?.includes('appointment')
      ));
    
    if (shouldCleanup) {
      console.log('  Running teardown: Cancelling appointment...');
      try {
        await dashboardPage.cancelAppointment('MRI');
        await dashboardPage.verifyAppointmentNotExists('MRI');
        console.log('  Teardown complete - appointment cancelled');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`  Teardown failed: ${errorMessage}`);
      }
    } else {
      console.log('  Skipping teardown - test failed before appointment creation');
    }
  });

  test('Should complete full booking journey', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const selectPlanPage = new SelectPlanPage(page);
    const schedulePage = new ScheduleScanPage(page);
    const paymentPage = new PaymentPage(page);
    const confirmationPage = new ConfirmationPage(page);

    console.log('Step 1: Logging in...');
    await loginPage.navigate();
    await loginPage.loginWithTestUser();
    await loginPage.verifyLoginSuccess();

    console.log('Step 2: Starting booking flow...');
    await dashboardPage.startBookingFlow();

    console.log('Step 3: Selecting MRI scan...');
    await selectPlanPage.completePlanSelection('MRI');

    console.log('Step 4: Scheduling appointment...');
    await schedulePage.completeScheduleSelection();

    console.log('Step 5: Processing payment...');
    await paymentPage.completePayment();

    console.log('Step 6: Verifying confirmation...');
    await confirmationPage.verifyCompleteConfirmation();

    console.log('Step 7: Verifying appointment in dashboard...');
    await dashboardPage.navigate();
    await dashboardPage.verifyAppointmentExists('MRI');
    
    console.log('  Test completed successfully - appointment created');
  });
});