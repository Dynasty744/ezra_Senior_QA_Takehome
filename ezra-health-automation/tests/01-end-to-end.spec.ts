import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SelectPlanPage } from '../pages/SelectPlanPage';
import { ScheduleScanPage } from '../pages/ScheduleScanPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { QuestionnairePage } from '../pages/QuestionnairePage';

test.describe('End-to-End Booking Flow', () => {
  test('should complete full booking journey @critical @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const selectPlanPage = new SelectPlanPage(page);
    const schedulePage = new ScheduleScanPage(page);
    const paymentPage = new PaymentPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.loginWithTestUser();
    await loginPage.verifyLoginSuccess();

    // Start booking
    await dashboardPage.startBookingFlow();

    // Select plan
    await selectPlanPage.completePlanSelection('MRI');

    // Schedule
    await schedulePage.completeScheduleSelection();

    // Payment
    await paymentPage.completePayment();

    // Verify confirmation
    await confirmationPage.verifyCompleteConfirmation();

    // Verify appointment in dashboard
    await dashboardPage.navigate();
    await dashboardPage.verifyAppointmentExists('MRI');
  });
});
