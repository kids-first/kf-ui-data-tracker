FROM cypress/included:4.2.0

WORKDIR /app

COPY cypress cypress
COPY cypress.json .
COPY cypress/package.json .
COPY cypress/yarn.lock .

ENV CI=1
RUN yarn install --frozen-lockfile

RUN yarn run cypress verify
