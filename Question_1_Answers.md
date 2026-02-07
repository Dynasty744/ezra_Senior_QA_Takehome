## Question 1
### Part 1
*The booking flow is integral to Ezra's business operation. Please go through the first
three steps of the booking process including payment and devise 15 test cases
throughout the entire process you think are the most important. When submitting the
assignment, please return the test cases from the most important to the least important.*

Test Cases

1. E2E happy path - verify a new user can successfully complete the entire booking flow from login -> scan selection -> location/time selection -> payment -> confirmation -> medical questionnaire
    * login to member facing portal
    * start booking flow from dashboard
    * input valid birthdate and sex
    * select a scan plan
    * choose a location and select date/time
    * enter payment info
    * verifying confirmation page with appt details
    * click "fill out medical questionnaire" CTA
    * complete and submit questionnaire
    * verify questionnaire submission confirmation
    * verify appt appears in user dashboard
    * verify confirmation email received

2. Payment process validation
    * complete booking flow up to "Reserve Your Appointment" page
    * test CC payment (valid stripe test data)
        * appt created
    * test failed CC (invalid test data)
        * appt not created
    * test other payment methods
        * affirm
        * bank
        * google pay
    * verify payment security
        * card details not visible in URL or local storage
        * verify secure HTTPS connection on page
        * check sensitive data is not exposed in browser console

3. Verify enforcement of 5 day questionnaire deadline and cancels appointment if not completed
    * create appointment for date X (7 days from today)
    * login on day 2, verify questionnaire should be accessible
    * verify questionnaire can be completed and submitted
    * create second appointment for date Y (7 days from today)
    * but do not complete questionnaire
    * wait until day 3, verify deadline has passed
    * check if appointment is cancelled
    * check if user receives cancellation notice
    * check questionnaire is no longer accessible or shows "deadline passed"
    * verify boundary case, between 5 and 4 days
    * verify questionnaire status after completion on dashboard
        * pending (not completed but still outside of 5 days)
        * completed (after completion)
        * overdue (after deadline)

4. Verify time slots accurately reflect availability and prevent double booking
    * select location and date
    * select a time slot and complete booking
    * using incognito on a seperate tab, login as different user
    * navigate to the same location, date, slot
    * make sure previously booked slot tis no longer available
    * edge case, two users simultaneously select same time slot
    * both attempt to book
    * verify only one succeeds, the other should get "time slot no longer available" error

5. Verify correct scan plan appear based on user selection
    * on "Review Your Plan" page, verify all scan types are displayed (MRI, CT, Heart, Lung, etc)
    * verify plan pricing displays correctly
    * verify plan description are accurate

6. Verify calendar only allows valid and allowed future dates
    * navigate to "Schedule Your Scan" and select location
    * verify calendar appears
    * validate date restrictions:
        * past dates are disabled and not selectable
        * today's date and time handling (may be grayed out if too late in day)
        * for new users, dates are at least 5 days in future (to accommodate questionnaire deadline)
        * dates extend far enough into future (e.g. 90 days)
        * depending on location, verify for weekend availability
        * check for holidays

7. 

### Part 2
For the top 3 test cases from part 1, please provide a description explaining why they
are indicated as your most important.