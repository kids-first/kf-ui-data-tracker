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

#### Setup backend API service

Study-creator served as backend provides the data APIs consumed by data-tracker frontend.

If you haven't already, create the kf-data-stack network:

```
docker network create kf-data-stack
```

Checkout kf-api-study-creator master and bring up the study creator API:
Checkout the [Kids First Data Stack](https://github.com/kids-first/kf-data-stack)
and make sure the study creator services are running:

```
docker-compose up study-creator
```

For more details on configuring the backend behavior, see the [Study Creator Documentation](https://kids-first.github.io/kf-api-study-creator/index.html).

#### Setup front-end server

If you haven't already, checkout kf-ui-data-tracker master:

```
git clone https://github.com/kids-first/kf-api-study-creator.git
cd kf-ui-data-tracker
```

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

Jest is used for functional testing and snapshot testing:

```
# To run jest test:
yarn run jest
# To generate/update snapshot test:
yarn run jest -u
```
