# Ezra Health Scan Playwright Automation Framework

---

## Overview

This framework automates critical user journeys for the Ezra health scan booking platform, focusing on two high-priority test scenarios:

1. **End-to-End Booking Flow** - Complete user journey from login through questionnaire
2. **Payment Processing** - Multi-method payment validation with security checks
---



### Design Patterns Used

1. **Page Object Model (POM)**
   - Encapsulates page-specific logic
   - Promotes code reusability
   - Reduces maintenance overhead

2. **Inheritance**
   - BasePage provides shared utilities
   - Pages extend base functionality

3. **Explicit Waits and Retry**
   - Custom wait strategies
   - Retry mechanisms for flaky elements

---

## Setup Instructions

### Prerequisites

- **Node.js**: v18+
- **npm**: v9+ or **yarn**: v1.22+
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ezra-health-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   BASE_URL=https://myezra-staging.ezra.com
   TEST_USER_EMAIL=tester01@tester.com
   TEST_USER_PASSWORD=P@ssword
   STRIPE_VALID_CARD=4242424242424242
   ```

5. **Verify installation**
   ```bash
   npx playwright --version
   ```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# End-to-end tests
npm test tests/01-end-to-end.spec.ts

# Payment tests
npm test tests/02-payment-validation.spec.ts
```

### Run in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

---

## Test Cases

### Test Case 1: End-to-End Critical User Journey

**Objective**: Verify complete booking flow from login to questionnaire completion

**Coverage**:
- User authentication
- Scan plan selection
- Location and time scheduling
- Payment processing
- Booking confirmation
- Appointment verification in dashboard

**Priority**: CRITICAL - Core revenue flow

**Location**: `tests/01-end-to-end.spec.ts`

---

### Test Case 2: Payment Process Validation

**Objective**: Ensure payment processing works correctly and securely

**Coverage**:
- Valid credit card payment (Stripe test card)
- Declined card handling
- Insufficient funds card
- Security verification (HTTPS, no data leakage)

**Priority**: CRITICAL - Revenue and PCI compliance

**Location**: `tests/02-payment-validation.spec.ts`

---

## Trade-offs & Assumptions

### Trade-offs Made

1. **Locator Strategy**
   - **Decision**: Multiple fallback locator strategies (data-testid, class, text)
   - **Trade-off**: More resilient but harder to maintain if HTML changes significantly
   - **Rationale**: Staging environment may not have stable test IDs

2. **Wait Strategy**
   - **Decision**: Custom explicit waits with timeouts
   - **Trade-off**: Tests run slower but more stable
   - **Rationale**: Healthcare applications may have slow backend processing
   - **Alternative**: Shorter timeouts with more retries

3. **Test Data**
   - **Decision**: Environment variables + hardcoded safe defaults
   - **Trade-off**: Less flexible but easier to run locally
   - **Rationale**: Simplifies onboarding for new team members

4. **Stripe Integration**
   - **Decision**: Multiple iframe fallback strategies
   - **Trade-off**: Complex iframe handling logic
   - **Fallback**: Other payment methods

### Key Assumptions

1. **Staging Environment Stability**
   - Staging environment is reasonably stable
   - Test user credentials remain valid
   - Stripe test mode is enabled

2. **Data Persistence**
   - Assumes appointments persist across test runs
   - Assumes no automatic cleanup of test data
   - May require teardown between test cycles

3. **Network Connectivity**
   - Assumes reliable internet connection
   - Assumes no firewall blocking external services (Stripe)
   - Assumes reasonable latency (< 3 seconds)

4. **Browser Compatibility**
   - Assumes latest browsers (Chrome, Firefox, Safari)
   - Assumes browser updates don't break existing tests

---

## Scalability Considerations

### Current Architecture Supports

1. **Horizontal Scaling**
   - Parallel test execution (configurable workers)
   - Can run across multiple machines/containers

2. **Vertical Scaling**
   - Page objects easy to extend
   - New test cases follow established patterns

3. **Test Data Management**
   - Environment-based configuration
   - Easy to add new test environments (dev, QA, prod)
   - Supports test data generation utilities

### Scaling for Growth

**When adding 50+ more tests:**

1. **Test Organization**
   ```
   tests/
   ├── critical/      # P0 tests
   ├── regression/    # P1 tests
   ├── smoke/         # Quick health checks
   └── integration/   # Multi-system tests
   ```

2. **Test Data Management**
   - Implement test data factories
   - Use database seeding for complex scenarios
   - Consider test data cleanup strategies

3. **Parallel Execution**
   - Increase worker count for faster runs
   - Implement test sharding for CI/CD
   - Use Playwright's built-in parallelization

4. **Reporting**
   - Integrate with test management tools (TestRail, Xray)
   - Custom dashboards for test metrics
   - Failure trend analysis

5. **Performance**
   - Implement page object caching
   - Optimize locator strategies
   - Consider headless-only execution for CI

---

## Future Enhancements

1. **Visual Regression Testing**
   - Catch UI regressions automatically
   - Compare screenshots across builds

2. **API Testing Integration**
   - Faster appointment creation via API
   - Verify data persistence

3. **Accessibility Testing**
   - WCAG 2.1 compliance
   - Screen reader compatibility
   
4. **Performance Testing**
   - Page load times
   - Core Web Vitals

5. **Email Verification**
   - Verify confirmation emails
   - Test email links and content
---