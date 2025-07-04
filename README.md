# Ko-fi Aggregation API

API for aggregating and accessing Ko-fi webhook data.
I created this because there is no API to access all Ko-fi subscriptions,
so the only way to access all data at once is to aggregate it yourself.

This project allows you to e.g. get all active Ko-Fi subscriptions
or all past donations.

Ko-fi webhook documentation: https://help.ko-fi.com/hc/en-us/articles/360004162298

## Endpoints

- `POST /webhooks/ko-fi` Ko-fi should send webhooks here
- `GET /donations` Gets all past donation payloads
- `GET /subscriptions` Gets all past subscription payloads
- `GET /subscriptions/active` Gets all active subscription payloads

Commissions, shop orders/items and shipping information are not supported.

The `/webhooks/ko-fi` endpoint is authenticated
using the `KO_FI_VERIFICATION_TOKEN` environment variable,
which will be set by Ko-fi automatically.
You only need to store it in the `.env` file (see setup instructions).

Any `GET` endpoint is authenticated using the `API_TOKEN`,
so that your donation and subscription information
cannot be accessed by third parties.

## Setup

Copy `.env.example` to `.env` and fill out these mandatory variables:

- `KO_FI_VERIFICATION_TOKEN` Verification token from
  https://ko-fi.com/manage/webhooks.
  This is used to verify that Ko-fi is the real source of any received webhooks.
- `API_TOKEN` Generate a random API token, e.g. using `openssl rand -hex 24`.
  This is used to authenticate requests to this API.

Optional variables:

- `STORE_TEST_WEBHOOKS` Whether to store test webhooks from the Ko-fi dashboard.
  This should only be used for testing and not during production.
  Test webhooks are not stored by default.

## Run

```sh
npm run dev  # development
npm run build && npm run --silent start  # production
```

## Export all webhook data

You can export aggregated webhook payloads using this script:

```
node scripts/export.js ./path/to/data.json
```

This will create a webhookPayloads.json in the current working directory.

## License

This project is licensed under the MIT License. See LICENSE for details.  
Copyright (c) 2025 Jonas van den Berg
