# Ezra Booking Flow - Test Cases

## Question 2

### Part 1: Medical Questionnaire Integration Test

---

#### API Request Interception For PHI Extraction :

##### Test Setup
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

##### Expected Response
    Status Code: 403
    Status Text: Forbidden
    Headers: Headers {}
    Response Body: {error: "Unauthorized access", code: "AUTH_403"}

##### Possible Vulnerability
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

### Part 2: HTTP Requests For Medical Questionnaire Integration Test

1. https://stage-api.ezra.com/individuals/member/connect/token
2. https://stage-api.ezra.com/individuals/api/members
3. https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/745ff2fe-cfca-43a0-a4df-70346df1a720/detail (could extract various IDs)
4. https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/2697/data (could expose PHI)

---

### Part 3: Analysis On Endpoint Security and QA Solutions

#### Situation:

- 100+ endpoints handling PHI
- Each endpoint could be a potential for breach
- Manual testing each endpoint for multiple scenarios not possible
- One missed check would be high risk of breach
- Security testing needs to be automated, scalable, and embedded into the development process

#### Solution:

##### Automation Tests For Every Endpoint

- Unauthenticated access - token and user role check
- Cross patient access - one patient should not access another
- API url tampering - modifying API url for breach
- API response data leak - should only contain authorized data
- Tests should be scheduled to run daily

##### Extra Layers Of Security

- Write a CLI tool for developers to run security checks before committing code
- Introduce security checks on new code push
- Enforce full test runs during deployment process for envs

#### Thoughts:

##### Negatives

- Heavy initial investment for automation
- Could impact existing development culture/habits/style
- Learning curve and maintenance
- Slow CI/CD pipeline

##### Positives

- After initial investment, payoff multiplies with each test run
- Greatly reduced manual efforts from automation coverage
- Easy to scale tests with new endpoints
- Reduced HIPAA violations and other compliance issues