<p align="center">
  <img src="public/data_tracker.svg" alt="data tracker logo" width="660px">
</p>
<p align="center">
  <a href="https://github.com/kids-first/kf-ui-data-tracker/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kids-first/kf-ui-data-tracker.svg?style=for-the-badge"></a>
  <a href="https://circleci.com/gh/kids-first/kf-ui-data-tracker"><img src="https://img.shields.io/circleci/project/github/kids-first/kf-ui-data-tracker.svg?style=for-the-badge"></a>
</p>

# Kids First Data Tracker

Investigator study management and progress tracking.

## Development Quick Start

#### Setup backend API service

Study-creator served as backend provides the data APIs consumed by data-tracker frontend.

If you haven't already, create the kf-data-stack network:

```
docker network create kf-data-stack
```

Checkout kf-api-study-creator master and bring up the study creator API:

```
docker-compose up
```

APIs endpoint would be viewable from http://localhost:8080/ as GraphiQL portal.
For more details, go to https://github.com/kids-first/kf-api-study-creator

#### Setup front-end server

If you haven't already, checkout kf-ui-data-tracker master:

```
git clone https://github.com/kids-first/kf-api-study-creator.git
cd kf-ui-data-tracker
```

Install all dependencies:

```
yarn
```

Start the server:

```
yarn start
```

#### Provide environmental variables

Create .env file from the root directory, and include the following variables:

```
REACT_APP_GOOGLE_APP_ID
REACT_APP_EGO_API
REACT_APP_STUDY_API
SKIP_PREFLIGHT_CHECK
REACT_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
REACT_APP_AUTH0_REDIRECT_URI
REACT_APP_AUTH0_AUD
```

#### Access kf-ui-data-tracker front-end

Go to http://localhost:3000/ and login to explore data-tracker
You can:

- Login with Auth0 or login with Ego
- View studies, files, and versions
- Annotate new files, edit existing files
- Upload/download/delete files
- Upload/download file versions
- View your profile, subscribe to Slack notifications
- Create/delete developer download tokens from http://localhost:3000/tokens

## Testing

Jest is used for functional testing and snapshot testing:

```
# To run jest test:
yarn run jest
# To generate/update snapshot test:
yarn run jest -u
```
