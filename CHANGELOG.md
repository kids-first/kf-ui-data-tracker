# Kids First Data Tracker Release 0.8.0

## Features

Adds required action alerts and various UX improvements.

### Summary

Feature Emojis: ✨x10 💄x3 🐛x2 ♻️x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x10 [usability improvement](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/usability%20improvement) x5 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x4 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x4 [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x4

### New features and changes

- (#484) ✨ FileElement copy download link action button - @bdolly
- (#496) 🐛 Add query name to solve Error writing result to store for query - @XuTheBunny
- (#495) ✨ Add alert for study data completeness to study info page - @XuTheBunny
- (#467) ✨ Add alert for study data completeness, files, and projects to study list - @XuTheBunny
- (#458) ✨ Updated Document Indicator - @bdolly
- (#485) ✨ Feature document name validation - @bdolly
- (#492) ✨ Feature version list item status tooltip - @bdolly
- (#481) 💄 Re-style Study  List Item attributes  - @bdolly
- (#491) ✨ Feature UserSnap widget  - @bdolly
- (#487) ✨ Add step view for study info page with editing mode - @XuTheBunny
- (#489) ✨ Edit Project modal - @dankolbman
- (#486) 💄 Add user friendly time formats to TimeAgo on hover - @XuTheBunny
- (#461) 💄 Re-style input hints for study form - @dankolbman
- (#482) 🐛 Hide copy button for masked tokens - @dankolbman
- (#473) ♻️ Refactor study list search by adding empty state and make kfId searchable - @XuTheBunny
- (#468) ✨ Add event logs tab view for ADMIN user with type filter and auto refresh - @XuTheBunny


# Kids First Data Tracker Release 0.7.0

## Features

New BIX features for Cavatica projects, UI refactoring and fixes.

### Summary

Feature Emojis: ✨x7 ♻️x4 💄x3 🐛x2 🔧x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x9 [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x6 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x4 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x2 [usability improvement](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/usability%20improvement) x1 [devops](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/devops) x1 [documentation](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/documentation) x1

### New features and changes

- (#476) 🐛 Allow selection of file type for normal users - @dankolbman
- (#466) ♻️ Refactor project button and link rendering - @XuTheBunny
- (#465) ✨ Add Cavatica tab with Cavatica projects and create/link/unlink actions - @XuTheBunny
- (#454) ♻️ Refactor create project and list project rendering - @XuTheBunny
- (#452) ✨ Upload document flow re-visited  - @bdolly
- (#453) 💄 Display api error message at the bottom of the edit study modal - @XuTheBunny
- (#447) ✨ Support markdown for study description - @XuTheBunny
- (#446) 💄 Refactor study edit layout and add more fields - @XuTheBunny
- (#445) 💄 Refactor study info layout - @XuTheBunny
- (#444) 🐛 Handle no projects - @dankolbman
- (#436) ✨ Add option to create which type of Cavatica projects on creating a new study - @XuTheBunny
- (#439) ✨ Add view for event history - @dankolbman
- (#438) ♻️ Reorganize event list - @dankolbman
- (#429) ✨ Add modal for link / unlink Cavatica project - @XuTheBunny
- (#435) ♻️ Refactor project list showing unlink button for admin user - @XuTheBunny
- (#432) 🔧 Update env schema - @dankolbman
- (#433) ✨ Add button to create first study for admins - @dankolbman


# Kids First Data Tracker Release 0.6.0

## Features

Adds views for creating studies and projects.

### Summary

Feature Emojis: ✨x10 🐛x4 💄x3 🔥x1 📝x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x10 [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x8 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x4 [component](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/component) x4 [devops](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/devops) x2 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x1 [documentation](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/documentation) x1

### New features and changes

- (#428) 🔥 Move role and group resolvers to server - @dankolbman
- (#426) ✨ Add form for new Cavatica project - @dankolbman
- (#427) 🐛 Don't show studies in profile if the user has none - @dankolbman
- (#424) ✨ Add modal for editing study information - @XuTheBunny
- (#425) 💄 Refactor Cavatica project list icon and link - @XuTheBunny
- (#420) ✨ Add study basic info screen for beta team - @XuTheBunny
- (#421) Bump eslint-utils from 1.3.1 to 1.4.2 - @dependabot[bot]
- (#416) 🐛 Fix new study form date field and Cavatica project study link - @XuTheBunny
- (#415) 🐛 Return deleted projects in sync mutation - @dankolbman
- (#414) 🐛 Fix new file annotation form by adding user object to it - @XuTheBunny
- (#413) ✨ Show information about deleted projects - @dankolbman
- (#403) ✨ Add form page for creating new study - @XuTheBunny
- (#412) ✨ Add Cavatica Project list view - @dankolbman
- (#410) ✨ Add drop down for admin functions - @dankolbman
- (#407) 💄 Hide filter and search bar on file list when no files exist - @XuTheBunny
- (#406) 💄 Show alternative image when no user profile photo exist - @XuTheBunny
- (#325) ✨ Feature user roles client state - @bdolly
- (#391) Bump lodash.template from 4.4.0 to 4.5.0 - @dependabot[bot]
- (#390) ✨ Search study by its name / short name from study list screen - @XuTheBunny
- (#389) ✨ Filter files by approval status/type, sort by created/modified date, and search by file title/description - @XuTheBunny
- (#384) 📝 Update README file with development and testing section - @XuTheBunny
- (#388) ♻️ Fragments for study field, file fields, version fields, and creator fields - @XuTheBunny


# Kids First Data Tracker Release 0.5.0

## Features

Replace ui kit with Semantic. General code improvements.

### Summary

Feature Emojis: 💄x5 ♻️x5 ✨x4 🐛x2 🔥 x1 x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x9 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x7 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x3 [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x3 [component](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/component) x2

### New features and changes

- (#385) 💄 Study File List sort status of changes needed to the top - @XuTheBunny
- (#369) ♻️  Replace Query component with HOC in study file list - @dankolbman
- (#371) ♻️  Replace Query component with HOC in study list - @dankolbman
- (#372) ♻️  Replace Query component with HOC in navbar - @dankolbman
- (#374) ♻️  Add Token fragment - @dankolbman
- (#379) 💄 Semantic - @dankolbman
- (#382) 🔥 Semantic ui style cleanup - @XuTheBunny
- (#327) 💄 Profile view bug fix and style updates - @XuTheBunny
- (#299) 💄 refactor modal positioning - @bdolly
- (#328) 🐛 Fix minor typo and style issue on file type and file description - @XuTheBunny
- (#326) 🐛 Fix file type icon mismatch - @XuTheBunny
- (#298) ✨ Redirect user back to the original requested page after login - @XuTheBunny
- (#297) 💄 Refactor pagination styling - @bdolly
- (#289) ♻️  Refactor upload verbiage - @bdolly
- (#296)  ✨ Add "uploading" stage to submit button when uploading new file or new version - @XuTheBunny
- (#294) ✨ Add profile dropdown to header - @XuTheBunny
- (#288) ✨ Add approval status dropdown to file annotation modal - @XuTheBunny
- (#292) ✨ Conditional rendering notification bar on top of file list - @XuTheBunny


# Kids First Data Tracker Release 0.4.0

## Features

Flow refactoring and notification settings.

### Summary

Feature Emojis: ♻️x5 ✨x4 🐛x1 🚚 x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x8 [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x5 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x4 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x1

### New features and changes

- (#285) ♻️  Refactor document edit modal - @XuTheBunny
- (#284) ✨ Add version detail modal - @XuTheBunny
- (#283) ✨ Study subscriptions manager - @dankolbman
- (#282) ♻️  Refactor version upload and annotation modal style - @XuTheBunny
- (#281) ♻️  Refactor version list component - @XuTheBunny
- (#274) ✨ Add user profile page - @dankolbman
- (#280) ♻️ Refactor a vatar component taking creator data - @XuTheBunny
- (#279) ♻️  Refactor badge component taking version state data - @XuTheBunny
- (#273) ✨ Add new version flow - @dankolbman
- (#272) 🐛 Multistep upload - @dankolbman
- (#265) 🚚 Rename .jsx files to .js - @dankolbman


# Kids First Data Tracker Release 0.3.0

## Features

Introduce new version uploading functionality.

### Summary

Feature Emojis: ✨x7 ♻️x3 💄Refactorx2 💄x2 🐛x2 ✅x2 👷x1 🚑x1 🔥 x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x9 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x6 [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x4 [component](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/component) x4 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x4 [devops](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/devops) x1 [ready-for-review](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/ready-for-review) x1

### New features and changes

- (#262) ✨ Add logout button - @dankolbman
- (#222) ♻️  Refactor study header - @XuTheBunny
- (#231) ✨ Add pagination on file list  - @XuTheBunny
- (#237) ✨ Add modal view for version upload and annotation - @XuTheBunny
- (#260) ♻️  Refactor editor and upload container - @XuTheBunny
- (#258) ✨ Add general svg icon rendering component - @XuTheBunny
- (#261) 💄Refactor study header style in grid layout - @XuTheBunny
- (#255) ✨ Add modal component - @XuTheBunny
- (#254) ✨ Add notification bar component - @XuTheBunny
- (#253) 💄Refactor copy button using svg icon as component - @XuTheBunny
- (#251) 💄 Update file type images to match the design - @XuTheBunny
- (#214) 👷 Add bundlesize status check - @dankolbman
- (#249) 💄 Align header to page content - @XuTheBunny
- (#248) 🐛 Remove duplicate props - @dankolbman
- (#226) ✨ Add file detail view - @XuTheBunny
- (#245) 🚑 Fix postcss inheritance - @bdolly
- (#233) 🔥 Remove unused file - @dankolbman
- (#235) 🐛 Update date compare function - @XuTheBunny
- (#234) ✅ Global Date.now() mocking - @dankolbman
- (#218) ♻️  Study File List improvements - @bdolly
- (#230) ✅ Functional testing for annotating - @dankolbman


# Kids First Data Tracker Release 0.2.0

## Features

### Summary

Feature Emojis: ♻️x11 📷x6 ⬆️x2 🐛x1 ✅x1 🤡x1 📦x1 🔧x1 📄x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x22 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x4 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x4 [devops](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/devops) x1 [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x1 [documentation](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/documentation) x1

### New features and changes

- (#215) ♻️ Refactor studies list - @bdolly
- (#225) ♻️ Implement SecondaryNav component to navbar - @XuTheBunny
- (#221) ♻️ Refactor copy button - @XuTheBunny
- (#223) ♻️ Refactor snapshot test data mock - @XuTheBunny
- (#194) 📷 Add snapshot tests for FileList components - @dankolbman
- (#195) 📷 Add snapshot tests for FileUploadTarget - @dankolbman
- (#196) 📷 Add snapshot tests for StudyHeader - @dankolbman
- (#197) 📷 Add snapshot tests for StudyList - @dankolbman
- (#213) ♻️ Refactor/use grid - @XuTheBunny
- (#216) ⬆️ Upgrade uikit - @dankolbman
- (#212) 🐛 Fix icon mocks - @dankolbman
- (#211) ✅ Test file deletion from FileList - @dankolbman
- (#210) ♻️ Delete file from query cache - @dankolbman
- (#206) ♻️ Delete token by name - @dankolbman
- (#205) ♻️ Update dev token list from cache - @dankolbman
- (#203) 🤡 Mock UI Kit Icon component - @dankolbman
- (#201) ⬆️ Bump uikit version from 0.3.1 to 0.5.0 with related style adjustment - @XuTheBunny
- (#192) 📷 Add snapshot tests for FileAnnotation - @dankolbman
- (#188) 📷 Snapshot tests CopyButton component - @dankolbman
- (#187) 📦 Add react-testing-library for testing - @dankolbman
- (#185) 🔧 Ensure dependencies use babel 7 - @dankolbman
- (#146) ♻️ Refactor loading state for study list and file list - @XuTheBunny
- (#148) ♻️ Refactor token view adding copy button - @XuTheBunny
- (#145) 📄 Add LICENSE file - @dankolbman
- (#144) ♻️ Refactor file element by adding loading css - @XuTheBunny

# Kids First Data Tracker Release 0.1.0

## Features

First release of the data tracker with study file uploader capabilities.

Data Tracker Release 0.1.0

## Features

### Summary

Feature Emojis: ✨x15 ♻️x13 💄x13 🚨x2 👷x2 🐛x1 🍱x1 🚚x1 x1 📦x1 🔧x1 📝x1 🚧x1 🎉x1

Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/feature) x19 [refactor](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/refactor) x18 [component](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/component) x13 [design](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/design) x5 [devops](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/devops) x5 [bug](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/bug) x1 [application state](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/application%20state) x1 [documentation](https://api.github.com/repos/kids-first/kf-ui-data-tracker/labels/documentation) x1

### New features and changes

- (#142) ♻️ Refactor badge by adding loading css - @XuTheBunny
- (#141) 💄 Add "Failed to upload file" alert - @XuTheBunny
- (#139) ♻️ Refactor file annotation style - @XuTheBunny
- (#137) ♻️ Refactor file list style - @XuTheBunny
- (#140) 💄 Add "no studies" screen when no studies returned - @XuTheBunny
- (#135) ✨ Add copy to clipboard feature - @XuTheBunny
- (#131) ✨ Add view for developer tokens - @dankolbman
- (#133) ♻️ Refactor study header - @XuTheBunny
- (#132) ♻️ Refactor study list view - @XuTheBunny
- (#130) ♻️ Refactor overall screen layout and update navbar look - @XuTheBunny
- (#129) ♻️ Disable live TimeAgo updates on file list - @XuTheBunny
- (#121) ♻️ Update login page with gradient on background and fixed text - @XuTheBunny
- (#110) 💄 Add badge - @XuTheBunny
- (#109) ✨ Save filetype selection in annotation view - @dankolbman
- (#108) 💄 Responsive layout - @XuTheBunny
- (#107) ✨ Add download via signed url - @dankolbman
- (#101) ✨ Add delete file button - @dankolbman
- (#100) 💄 Add annotation page style - @XuTheBunny
- (#97) 💄 Add file list component - @XuTheBunny
- (#96) 💄 Add loading stage with "LOADING (component name) ..." - @XuTheBunny
- (#91) 💄 Add sub nav bar to file view - @XuTheBunny
- (#93) ✨ Annotation Flow - @dankolbman
- (#90) ♻️ Refactor Header component routing - @XuTheBunny
- (#89) 💄 Update study list routing and StudyCard component - @XuTheBunny
- (#86) 💄 Update study list view with new style - @XuTheBunny
- (#88) 💄 Redirect user to home page "/" when click on header logo - @XuTheBunny
- (#82) ✨ Add Auth0 login - @dankolbman
- (#85) 💄 Show empty state message when no studies returned - @XuTheBunny
- (#83) 💄 Add page header - @XuTheBunny
- (#79) ✨ Add banner component - @XuTheBunny
- (#77) ♻️ Refactor upload target - @dankolbman
- (#48) ✨ Refresh login view - @liberaliscomputing
- (#78) 🐛 Fix GridContainer propTypes - @dankolbman
- (#76) 🍱 Update favicon - @XuTheBunny
- (#72) 🚚 Rename FileUploadView to FilesView - @dankolbman
- (#70) ♻️ Switch to routing based on kf_id - @dankolbman
- (#69) 🚨 Make circle fail on eslint warnings - @dankolbman
- (#63) Add netlify redirects for SPA - @dankolbman
- (#67) 📦 Use pinned UIKit package - @dankolbman
- (#65) 🔧 Add netlify master branch config - @dankolbman
- (#57) ♻️ Use apollo components - @dankolbman
- (#56) ♻️ Refactor queries - @dankolbman
- (#55) 📝 Add README file with logo - @dankolbman
- (#54) 👷 Add Jenkinsfile - @dankolbman
- (#51) 🚧 Add data-uploader/add-prettier - @liberaliscomputing
- (#52) 👷 Adds circleci config to run eslint - @bdolly
- (#40) ✨ Initial Study File Upload Implementation - @bdolly
- (#39) ✨ Add data-uploader/file-upload - @liberaliscomputing
- (#33) ✨ adds Data uploader/grid component - @bdolly
- (#30) ✨ postcss setup - @bdolly
- (#31) ✨ Add Apollo client - @dankolbman
- (#29) ✨ Add Ego authentication - @XuTheBunny
- (#28) 🚨 Apply prettier formatting across the project - @XuTheBunny
- (#24) 🎉 Start developing data uploader - @liberaliscomputing
