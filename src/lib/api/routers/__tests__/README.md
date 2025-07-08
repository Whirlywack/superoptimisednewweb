# API Router Tests

This directory contains comprehensive test suites for all API routers in the application, covering question management, voting functionality, real-time statistics, and background job processing.

## Test Structure

### Core Router Tests
- **`questionRouter.test.ts`** - Tests for question retrieval and management
- **`voteRouter.test.ts`** - Tests for vote submission and statistics
- **`blogRouter.test.ts`** - Tests for blog/content management (existing)
- **`contentRouter.test.ts`** - Tests for content block management (existing)

### Supporting Feature Tests
- **`error-handling.test.ts`** - Tests for custom error classes and tRPC error handling
- **`rate-limiting.test.ts`** - Tests for IP-based rate limiting functionality
- **`statistics-xp.test.ts`** - Tests for real-time statistics and XP calculation
- **`background-jobs.test.ts`** - Tests for background job processing and queues

### Test Utilities
- **`test-utils.ts`** - Reusable mocks, factories, and validation helpers

## Question Type Coverage

The test suite covers all supported question types:

### 1. Binary Questions
- **Format**: `"Yes"` or `"No"` string responses
- **Testing**: Vote submission, results aggregation with percentages
- **Example**: "Do you prefer TypeScript over JavaScript?"

### 2. Multiple Choice Questions
- **Format**: Single string selection from predefined options
- **Testing**: Vote submission, option validation, results breakdown
- **Example**: "What's your favorite frontend framework?"

### 3. Rating Questions
- **Format**: Numeric rating (1-5, 1-10, etc.)
- **Testing**: Range validation, average calculation, distribution analysis
- **Example**: "Rate your satisfaction with the current UI (1-5)"

### 4. Ranking Questions
- **Format**: Array of strings in preferred order
- **Testing**: Order validation, ranking analysis, position tracking
- **Example**: "Rank these features by importance"

### 5. Text Questions
- **Format**: Free-form text responses
- **Testing**: Length validation, content filtering, response aggregation
- **Example**: "What features would you like to see next?"

### 6. A/B Test Questions
- **Format**: Variant selection (`"variant-a"` or `"variant-b"`)
- **Testing**: Variant distribution, statistical significance
- **Example**: "Which login design do you prefer?"

## Voting Scenarios Tested

### Authentication & Authorization
- Anonymous voting via voter tokens
- Duplicate vote prevention
- IP-based rate limiting
- Token validation and expiration

### Vote Submission Flow
- Question validation (active, within date range)
- Response data validation per question type
- Rate limit checking
- Duplicate vote detection
- Vote recording
- Background job queuing

### Error Handling
- Question not found errors
- Rate limit exceeded errors
- Duplicate vote errors
- Invalid voter token errors
- Database connection failures
- Validation errors

### Background Processing
- XP calculation with bonuses
- Engagement statistics updates
- Live statistics updates
- Milestone detection
- Streak calculation
- Email notifications

## Rate Limiting Tests

### IP-Based Rate Limiting
- Request counting per IP address
- Time window management
- Rate limit reset logic
- Concurrent request handling

### Action-Specific Limits
- Vote submission limits
- Newsletter signup limits
- Different limits per action type
- Cross-action isolation

### Security Tests
- Rate limit bypass prevention
- IP spoofing protection
- Attack scenario handling
- Cleanup of expired limits

## Statistics & XP System Tests

### XP Calculation
- Base XP per vote (10 XP)
- Streak bonuses (consecutive daily voting)
- Milestone bonuses (10, 25, 50, 100, 250 votes)
- Category completion bonuses
- Multiple bonus stacking

### Real-time Statistics
- Live vote count updates
- Unique voter tracking
- Total XP awarded
- Active question counts
- Performance optimization

### Engagement Statistics
- Streak calculation (consecutive days)
- Longest streak tracking
- Total votes per user
- XP accumulation
- Milestone achievement tracking

## Background Job Processing

### Vote Enhancement Jobs
- Asynchronous XP calculation
- Engagement stats updates
- Live statistics updates
- Milestone notifications
- Error handling and retries

### Data Cleanup Jobs
- Expired rate limit cleanup
- Stale voter token removal
- Old job record cleanup
- Performance optimization

### Job Queue Management
- Job prioritization (new users)
- Concurrent processing
- Failure handling
- Retry logic
- Performance monitoring

## Test Utilities and Mocks

### Mock Factories
- `createMockQuestion()` - Generate test questions
- `createMockVoterToken()` - Generate test voter tokens
- `createMockQuestionResponse()` - Generate test vote responses
- `createMockXpLedger()` - Generate test XP records

### Question Type Mocks
- `questionTypeMocks` - Pre-configured question data for each type
- `responseTypeMocks` - Valid response examples for each type

### Database Mocks
- `createMockPrisma()` - Complete Prisma client mock
- `createMockContext()` - tRPC context factory
- Database operation mocking

### Validation Helpers
- `validateQuestionResponse()` - Validate vote response structure
- `validateVoteStats()` - Validate statistics structure
- `validateEngagementStats()` - Validate engagement data

### Performance Testing
- `createPerformanceTest()` - Time-bound test execution
- `createLoadTest()` - Concurrent request testing
- Response time validation

## Running the Tests

```bash
# Run all API router tests
npm test src/lib/api/routers

# Run specific test file
npm test questionRouter.test.ts

# Run tests with coverage
npm test -- --coverage src/lib/api/routers

# Run tests in watch mode
npm test -- --watch src/lib/api/routers
```

## Test Coverage Goals

The test suite aims for:
- **Functions**: 60%+ coverage (Jest config threshold)
- **Lines**: 60%+ coverage
- **Branches**: 60%+ coverage
- **Statements**: 60%+ coverage

### Critical Path Coverage
- 100% coverage of vote submission flow
- 100% coverage of error handling paths
- 100% coverage of rate limiting logic
- 90%+ coverage of XP calculation
- 90%+ coverage of statistics updates

## Mock Strategy

### Database Mocking
- All Prisma operations are mocked
- Consistent mock data across tests
- Error scenario simulation
- Performance characteristic mocking

### External Service Mocking
- Email service (sendEmail) mocking
- Background job queue mocking
- Progress automation mocking
- Crypto function mocking

### Time-Sensitive Testing
- Date/time mocking for consistency
- Timezone handling
- Streak calculation validation
- Rate limit window testing

## Performance Considerations

### Test Execution Speed
- Parallel test execution
- Efficient mock setup/teardown
- Minimal database simulation
- Fast assertion patterns

### Load Testing
- Concurrent request simulation
- Rate limit stress testing
- Background job processing limits
- Memory usage validation

### Real-world Scenarios
- High-volume voting simulation
- Concurrent user testing
- Database failure simulation
- Network timeout handling

## Continuous Integration

### Test Automation
- All tests run on PR creation
- Coverage reporting
- Performance regression detection
- Error rate monitoring

### Quality Gates
- Minimum coverage thresholds
- No failing tests allowed
- Performance benchmarks
- Security vulnerability scans

## Contributing

### Adding New Tests
1. Follow existing test patterns
2. Use test utilities for consistency
3. Include error scenarios
4. Add performance considerations
5. Document test purpose

### Test Maintenance
- Keep mocks up to date with schema changes
- Update test data for new question types
- Maintain performance benchmarks
- Review and update coverage goals

### Best Practices
- Test behavior, not implementation
- Use descriptive test names
- Group related tests logically
- Mock external dependencies
- Validate error conditions
- Test edge cases

## Troubleshooting

### Common Issues
- Mock setup/teardown problems
- Async test timing issues
- Database mock inconsistencies
- Time-dependent test failures

### Debugging Tips
- Use descriptive test names
- Add console.log for debugging
- Check mock call counts
- Verify async operation completion
- Review error messages carefully

This comprehensive test suite ensures the reliability, security, and performance of the question and voting system, providing confidence in the API's behavior under various conditions.