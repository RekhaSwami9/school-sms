# Deployment Readiness TODO

## Phase 1: Backend APIs (Subjects, Parents, Fees)

### Subjects Management

- [x] Create Subject model (`sms-backend/src/models/subject.js`)
- [x] Create Subject controller (`sms-backend/src/controllers/subjectController.js`)
- [x] Create Subject routes (`sms-backend/src/routes/subjects.js`)
- [x] Update server.js with subjects routes

### Parents Management

- [x] Create Parent model (`sms-backend/src/models/parent.js`)
- [x] Create Parent controller (`sms-backend/src/controllers/parentController.js`)
- [x] Create Parent routes (`sms-backend/src/routes/parents.js`)
- [x] Update server.js with parents routes

### Fees Management

- [x] Create Fee model (`sms-backend/src/models/fee.js`)
- [x] Create Fee controller (`sms-backend/src/controllers/feeController.js`)
- [x] Create Fee routes (`sms-backend/src/routes/fees.js`)
- [x] Update server.js with fees routes

## Phase 2: Frontend Integration

### Subjects

- [ ] Create subjectService (`sms-frontend/src/services/subjectService.js`)
- [ ] Update SubjectList.jsx to use backend API

### Parents

- [ ] Create parentService (`sms-frontend/src/services/parentService.js`)
- [ ] Update ParentDirectory.jsx to use backend API

### Fees

- [ ] Create feeService (`sms-frontend/src/services/feeService.js`)
- [ ] Update FeeManager.jsx to use backend API

## Phase 3: Deployment Configuration

- [ ] Add environment variable documentation
- [ ] Create production build scripts
- [ ] Add error boundaries
- [ ] Create README with setup instructions

## Progress: 40% (Backend Complete, Frontend Pending)
