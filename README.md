<p align="center">
  <img src="public/data_tracker.svg" alt="data tracker logo" width="660px">
</p>
<p align="center">
  <a href="https://github.com/kids-first/kf-ui-data-tracker/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kids-first/kf-ui-data-tracker.svg?style=for-the-badge"></a>
  <a href="https://circleci.com/gh/kids-first/kf-ui-data-tracker"><img src="https://img.shields.io/circleci/project/github/kids-first/kf-ui-data-tracker.svg?style=for-the-badge"></a>
  <a href="https://codecov.io/gh/kids-first/kf-ui-data-tracker"><img src="https://img.shields.io/codecov/c/gh/kids-first/kf-ui-data-tracker?style=for-the-badge"></a>
</p>

# Kids First Data Tracker

Investigator study management and progress tracking.

## Development Quick Start

If you haven't already, checkout the kf-ui-data-tracker master branch:

```
git clone https://github.com/kids-first/kf-ui-data-tracker.git
cd kf-ui-data-tracker
```

#### Setup backend API service

Study-creator served as backend provides the data APIs consumed by data-tracker frontend.

If you haven't already, create the kf-data-stack network and necessary external volume:

```
docker network create kf-data-stack
docker volume create --name=bundle
```

Next bring up the study creator API in development mode:

```
docker-compose up web
```

For more details on configuring the backend behavior, see the
[Study Creator Documentation](https://kids-first.github.io/kf-api-study-creator/index.html).

#### Setup front-end server

Install all dependencies and start the server:

```
yarn
yarn start
```

#### Provide environmental variables

Create .env file from the root directory, and include the following variables:

```
REACT_APP_STUDY_API
SKIP_PREFLIGHT_CHECK
REACT_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
REACT_APP_AUTH0_REDIRECT_URI
REACT_APP_AUTH0_AUD
```

You will either need to contact the maintainer of the repository to set 
`REACT_APP_AUTH0_CLIENT_ID` with an existing client ID or you will need to 
setup an application in Auth0 and use it to set the `REACT_APP_AUTH0_CLIENT_ID`
variable. Make sure to configure the application to allow redirects at the 
local server's address (typically http://localhost:3000/callback)

See the provided `.env.schema` file for more details.

#### Access kf-ui-data-tracker front-end

The development server should default to `http://localhost:3000` where you may
view the Data Tracker in a development environment.

Features include:

- Login with Auth0
- View studies, files, and versions
- Annotate new files, edit existing files
- Upload/download/delete files
- Upload/download file versions
- View your profile, subscribe to Slack notifications
- Create/delete developer download tokens from http://localhost:3000/tokens

## Testing

Tests are split into two categories depending on what is being tested.
Function and single component level tests that are free of significant API
state are tested using unit tests and Jest.
For more complicated interactions that are state and network request heavy,
Cypress is run with a full-backing API to provided data.

### Unit Tests

Jest is used for functional testing and snapshot testing:
```
yarn test
# To generate/update snapshot test:
yarn run jest -u
```
### Integration Tests

Cypress is used to perform integration tests.

There must be a Study Creator API running with the mock data loaded and a
local Data Tracker application must be running on port `3000`.
This setup can be bootstrapped with the included `docker-compose.yml`:
```
docker-compose up -d
```
The tests may then be run either with the interactive test runner, or with a
headless browser:
```
yarn cy:open
# or
yarn cy:test
```
