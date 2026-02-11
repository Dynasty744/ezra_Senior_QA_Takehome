# Ezra Booking Flow - Test Cases

## Question 2

### Part 1: Medical Questionnaire Integration Test

---

#### API request interception for PHI extraction :

##### Test setup
    Victim Patient (questionnaire ID - 1234)
    Attacker Patient (questionnaire ID - 4321)

1. Attack opens browser developer tools (network tab)
2. Log into own account and starts the questionnaire
3. Filter for "data" and Fetch/XHR
4. Locate the *data* request that fetches questionnaire
5. Right click on the call and copy as fetch
6. Open browser console and paste into window
7. Modify questionnaire ID from 4321 to 1234 (victim's ID)
8. Send request via console

##### Expected response
    Status Code: 403
    Status Text: Forbidden
    Headers: Headers {}
    Response Body: {error: "Unauthorized access", code: "AUTH_403"}

##### Possible vulnerability
    Status Code: 200
    Status Text: OK
    Headers: Headers {}
    Response Body: (96) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

##### Conclusion

- Attackers could use this method to retrieve other patients' PHI. There are a few instances which may make this possible:
    - If server side authorization is skipped for certain calls
    - Authorization logic not implemented correctly
    - Authentication vs authorization faults
    - Mismatched design intension between FE and BE

---

### Part 2: HTTP requests for Medical Questionnaire Integration Test

- https://stage-api.ezra.com/individuals/member/connect/token
- https://stage-api.ezra.com/individuals/api/members
- https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/745ff2fe-cfca-43a0-a4df-70346df1a720/detail (could extract various IDs)
- https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/2697/data (could expose PHI)