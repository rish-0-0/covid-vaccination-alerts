# Covid Vaccination Centres Availability Alerts
To generate alerts using the APIs available publicly for CoWIN and ArogyaSetu.
We would either be using firebase cloud messaging (FCM) for notifications and / or OneSignal.
## Dev Setup

It's a pretty complicated setup.
### Prerequisites:
- Docker & Docker-Compose to be installed
- NodeJS, `npm` and `yarn`

### For development:
- In the `rest-api` directory, run `npm i`
- In the `scheduler` directory, run `npm i`
- In the `vaccine-alerts-ui` directory run `yarn`

## Production Setup:

### Prerequisites:
- Docker & Docker-Compose

- `docker-compose up --build -d`