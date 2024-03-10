# Patient Information Backend Service

This service is designed to fetch and add patient visit information. It is written in TypeScript and uses the Supabase CLI for local development and testing.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

- Access to a deployed Azure Health Services FHIR API
- Deno
- Supabase CLI
- Docker CLI

### Environment Variables

This project uses the following environment variables, which are defined in `.supabase/functions/.env`:

- `AZURE_AD_TENANT_ID`: Azure tenant where the FHIR service is deployed in. It's located from the Application registration overview menu option.
- `AZURE_CLIENT_ID`: Application client registration ID.
- `AZURE_CLIENT_SECRET`: Application client registration secret.
- `AZURE_FHIR_SERVICE_URL`: The FHIR service full URL. For example, `https://xxx.azurehealthcareapis.com`. It's located from the FHIR service overview menu option.

### Installing

#### 1. Clone repository
```bash
git clone <repository-url>
```

#### 3. Setup environment variables
Please reffer to the environment variables section.

#### 2. Start the Supabase local development server
```bash
supabase start
```

## Usage
This repository provides the following edge functions:

- `getVisit`: Fetches a patient's visit information.
- `newVisit`: Adds a new visit for a patient.
- `patientInfos`: Gets a patient's and his last visit's information.

To call the `getVisit` function, make an HTTP request:
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/getVisit' \
  --header 'Authorization: Bearer <your-token>' \
  --header 'Content-Type: application/json' \
  --data '{"patient_id": "<patient-id>", "visit_id": "<visit-id>"}'
```

To call the `newVisit` function, make an HTTP request:
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/newVisit' \
  --header 'Authorization: Bearer <your-token>' \
  --header 'Content-Type: application/json' \
  --data '{"patient_id": "<patient-id>", "visit_details": "<visit-details>"}'
```

To call the `patientInfos` function, make an HTTP request:
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/patientInfos' \
  --header 'Authorization: Bearer <your-token>' \
  --header 'Content-Type: application/json' \
  --data '{"patient_id": "<patient-id>"}'
```

Replace `<your-token>`, `<patient-id>`, `<visit-id>`, and `<visit-details>` with your actual values.

## Shared Functions
The .supabase/functions/_shared folder contains utility functions used across the project:

- `getFHIRAccessToken`: Getting the FHIR API access token in order to call the FHIR API.
- `getPatientFHIRData`: Getting the patient's FHIR Data including medications and treatment, allergies, condition, and vital signs.
- `getPatientVisit`: Get information about a specific visit, including the patient's mood, taken medications, and symptomes.
- `supabaseAdmin`: Creates a service role supabase client.
- `supabaseClient`: Creates a supabase client using the user's JWT token.

## Deployment

In order to deploy this backend, please reffer to Supabase's documentation [on how to deploy edge functions to production](https://supabase.com/docs/guides/functions/deploy).

## Built With
- TypeScript
- Supabase
- Deno