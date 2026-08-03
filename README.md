# Insurance Demo UI

Client-facing POC for the [`insurance-api`](../insurance-api) referral pipeline.
Simulates the **insured user** flow of an e-guarantee referral request (Georgian UI).

## Flow

| Step | Screen | Contents |
| --- | --- | --- |
| 1 | `E-საგარანტიო მიმართვა` | required-documents notice, policy selector, guarantee-type selector |
| 2 | `მიმართვა …-ისთვის` | medical service selector, complaints textarea, specialist / clinic / date, doctor name, document uploader |
| 3 | `მიმართვის დადასტურება` | review of everything, submit |
| — | result | extraction, validation gates and per-referral verdicts returned by the API |

## Run

```bash
npm install
npm run dev          # http://localhost:5173
```

Point it at the API (defaults to `http://localhost:3000`):

```bash
cp .env.example .env    # VITE_API_URL=http://localhost:3000
```

## API integration

Submit posts `multipart/form-data` to `POST /api/referrals`:

- `documents` — a ZIP built in the browser with `fflate`, matching the `adm-zip` unpacking on the server
- `metadata` — JSON matching `CreateReferralSchema`: `source`, `patient` (taken from the selected mock policy), `clinicName`, `comment`, `recentReferrals`

If the response comes back `PENDING` / `PROCESSING`, the UI polls `GET /api/referrals/:id` every 3s (up to 2 min).

If the API is unreachable, an error banner offers a **simulated** response so the flow can still be demoed — that view is explicitly labelled `დემო რეჟიმი`.

## Mock data

`src/data/mock.ts` — policies, guarantee types, medical services, specialists, clinics, recent referrals.

The first two clinics (`შპს რეიმანი`, `შპს სამედიცინო პარაზიტოლოგიის …`) are the ones present in the API's price dataset, so price resolution returns real matches when the backend is seeded.

## Structure

```
src/
  api/client.ts        API calls + browser-side zipping
  components/          Select, DateField, FileUploader, Layout (topbar/footer/field), Icons
  data/mock.ts         all mock catalogs
  steps/               StepPolicy, StepDetails, StepReview, ResultView
  simulation.ts        offline fallback response
  index.css            design tokens + all styles
```
