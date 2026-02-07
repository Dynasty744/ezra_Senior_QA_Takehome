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

### Part 2
For the top 3 test cases from part 1, please provide a description explaining why they
are indicated as your most important.