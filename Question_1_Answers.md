# Ezra Booking Flow - Test Cases

## Question 1

### Part 1: Test Cases

---

#### 1. End-to-End Critical User Journey
**Objective:** Verify a user can successfully complete the entire booking flow

**Test Steps:**
- Login to member-facing portal
- Start booking flow from dashboard
- Input valid birthdate and sex
- Select a scan plan
- Choose a location and select date/time
- Enter payment information
- Verify confirmation page with appointment details
- Click "Fill out medical questionnaire" CTA
- Complete and submit questionnaire
- Verify questionnaire submission confirmation
- Verify appointment appears in user dashboard
- Verify confirmation email received

---

#### 2. Payment Process Validation
**Objective:** Ensure payment processing works correctly across different methods

**Test Scenarios:**

**Valid Payment:**
- Complete booking flow up to "Reserve Your Appointment" page
- Test credit card payment with valid Stripe test data
- Verify appointment is created

**Failed Payment:**
- Use invalid credit card test data
- Verify appointment is NOT created

**Alternative Payment Methods:**
- Test Affirm
- Test bank transfer
- Test Google Pay

**Payment Security:**
- Verify card details are not visible in URL or local storage
- Verify secure HTTPS connection on payment page
- Check sensitive data is not exposed in browser console

---

#### 3. Questionnaire Deadline Enforcement
**Objective:** Verify 5-day questionnaire deadline enforcement and automatic appointment cancellation

**Test Scenario 1 - Completed on Time:**
- Create appointment for date X (7 days from today)
- Login on day 2, verify questionnaire is accessible
- Complete and submit questionnaire
- Verify questionnaire status shows as "Completed"

**Test Scenario 2 - Missed Deadline:**
- Create second appointment for date Y (7 days from today)
- Do NOT complete questionnaire
- Wait until day 3 (after 5-day deadline)
- Verify appointment is cancelled
- Verify user receives cancellation notice
- Verify questionnaire shows "Deadline passed" message

**Boundary Testing:**
- Test edge case between 5 and 4 days remaining

**Status Verification:**
- Pending (not completed, outside 5-day window)
- Completed (after submission)
- Overdue (after deadline passes)

---

#### 4. Time Slot Availability & Double Booking Prevention
**Objective:** Ensure time slots accurately reflect availability and prevent double bookings

**Test Steps:**
- Select location and date
- Select a time slot and complete booking
- In incognito/separate browser, login as different user
- Navigate to same location, date, and time
- Verify previously booked slot is no longer available

**Concurrent Booking Test:**
- Two users simultaneously select same time slot
- Both attempt to book
- Verify only one succeeds
- Verify other user receives "Time slot no longer available" error

---

#### 5. Calendar Date Restrictions
**Objective:** Verify calendar only allows valid and permitted future dates

**Test Steps:**
- Navigate to "Schedule Your Scan" and select location
- Verify calendar appears

**Validation Checks:**
- Past dates are disabled and not selectable
- Today's date handling (grayed out if too late in day)
- For new users: dates are at least 5 days in future (questionnaire deadline accommodation)
- Dates extend sufficiently into future (e.g., 90 days)
- Location-specific weekend availability
- Holiday restrictions

---

#### 6. Authentication & Session Management
**Objective:** Verify user must be logged in and session remains active throughout booking

**Unauthenticated Access Test:**
- Navigate directly to booking URL without login
- Verify redirect to login page

**Session Timeout Test:**
- Login and start booking flow
- Wait for session timeout period
- Verify redirect to login screen
- Verify user can resume after re-authenticating

---

#### 7. Heart CT Scan Rejection Flow
**Objective:** Verify scan rejection works properly based on questionnaire responses

**Test Steps:**
- Navigate to "Review Your Plan" page
- Select Heart CT Scan and click Continue
- Answer "Yes" to ANY ONE of the disqualifying questions
- Complete remaining questions
- Verify "We're sorry, this product isn't right for you" dialog appears
- Verify user can navigate back from dialog
- Verify user can choose another scan type

---

#### 8. State-Based Location Filtering
**Objective:** Verify state selection correctly filters available locations

**Test Steps:**
- Navigate to "Schedule Your Scan" page
- Select State: California
- Verify only California locations display
- Change state to Florida
- Verify locations update to show only Florida centers
- Test state with no locations available
- Verify "No centers available" message displays
- Select location and verify calendar appears

---

#### 9. Birthdate & Sex Field Validation
**Objective:** Verify proper validation for birthdate and sex fields

**Test Cases:**
- **Blank field:** Continue button should be grayed out
- **Invalid date format:** Verify error message
- **Future date:** Verify error message
- **Age < 18 years:** Verify age handling policy
- **Valid date:** Verify acceptance and continuation

---

#### 10. Scan Plan Display Validation
**Objective:** Verify correct scan plans appear based on user selection

**Test Steps:**
- Navigate to "Review Your Plan" page
- Verify all scan types are displayed (MRI, CT, Heart, Lung, etc.)
- Verify plan pricing displays correctly
- Verify plan descriptions are accurate

---

#### 11. Location Detection Feature
**Objective:** Verify "Find closest centers to me" feature works correctly

**Permission Granted:**
- Navigate to "Schedule Your Scan" page
- Click "Find closest centers to me"
- Allow location permission in browser/system
- Verify centers are sorted by distance from user's location

**Permission Denied:**
- Deny location permission
- Verify graceful error message displays
- Verify user can still filter by selecting State manually

---

#### 12. Appointment Rescheduling
**Objective:** Verify user can reschedule an existing appointment

**Test Steps:**
- Create an appointment via booking flow
- Verify appointment exists on dashboard
- Click "Reschedule"
- Select a different future date/time
- Verify modified appointment displays correctly on dashboard
- Verify updated confirmation

---

#### 13. Appointment Cancellation
**Objective:** Verify user can cancel an appointment

**Test Steps:**
- Create an appointment via booking flow
- Verify appointment exists on dashboard
- Click "Cancel"
- Select a cancellation reason
- Verify reason field is required
- Verify cancellation confirmation page displays
- Verify appointment no longer shows on dashboard
- Verify cancellation email/notification received

---

#### 14. Accessibility Testing
**Objective:** Verify application is accessible to all users

**Test Areas:**
- Screen reader compatibility and functionality
- Keyboard navigation for entire booking flow
- ARIA labels and semantic HTML
- Color contrast ratios
- Focus indicators

---

#### 15. Cross-Browser & Device Compatibility
**Objective:** Verify booking flow works across different browsers and devices

**Desktop Browsers (Latest Versions):**
- Chrome
- Firefox
- Safari
- Edge

**Mobile Devices:**
- iOS Safari
- Android Chrome

**Verification:**
- All functionality works correctly
- Responsive design displays properly

---

### Part 2: Top 3 Priority Test Cases

  1. This test case covers the main revenue flow
  2. Covers financial security, payment methods, and compliance
  3. Deep test a required component within the main revenue flow

  With these 3 test cases, they form the critical path for  business viability. If any of these fail, then the business cannot generate revenue. Other test cases will support these core functions but isn't immediately critical.

---

## Question 2

### Part 1: 

---

### Part 2:

### HTTP Requests:

#### 1. End-to-End Critical User Journey

1.  POST /api/auth/login
2.  GET /api/scan-types
3.  POST /api/appointments/plan
4.  GET /api/locations?state=CA
5.  GET /api/locations/{locationId}/availability?scanType={scanType}
6.  GET /api/locations/{locationId}/timeslots?date={date}
7.  POST /api/appointments/schedule
8.  POST /api/payments/create
9.  POST /api/payments/process
10. GET /api/appointments/{appointmentId}/confirmation
11. GET /api/questionnaires/{appointmentId}
12. POST /api/questionnaires/{questionnaireId}/submit
13. GET /api/appointments

#### 2. Payment Process Validation




---

### Part 3: