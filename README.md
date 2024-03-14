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

### Setting up the database

#### Description

In order to store and manage generated data, we will have to create a SQL relational database. Let's create the following tables, respecting the schema down bellow:
- patients: storing the patient's information.
- visits: storing done visits.
- mood: storing a patient's move during a given visit.
- symptoms: storing the patient's symptoms during a given visit.
- medication: storing medications taken by a patient at a given visit.

![database schema](https://i.ibb.co/9wWktR5/scenario2schema.png)

#### Steps

1. Navigate to http://127.0.0.1:54323 in order to access your local Supabase interface.

2. Once you have accessed the interface, navigate to the SQL Editor present in the left menu bar.

3. Now, create necessary tables by executing the following SQL query in the editor:

```sql
-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY,
    patient_id UUID PRIMARY KEY REFERENCES patients(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create symptoms table
CREATE TABLE symptoms (
    visit_id UUID PRIMARY KEY REFERENCES visits(id),
    patient_id UUID PRIMARY KEY REFERENCES patients(id),
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medication table
CREATE TABLE medication (
    visit_id UUID PRIMARY KEY REFERENCES visits(id),
    patient_id UUID PRIMARY KEY REFERENCES patients(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    taken TEXT
);

-- Create mood table
CREATE TABLE mood (
    visit_id UUID PRIMARY KEY REFERENCES visits(id),
    patient_id UUID PRIMARY KEY REFERENCES patients(id),
    level INT2 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
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

- `FHIRResources`: Defining FHIR API resources interfaces.
- `getFHIRAccessToken`: Getting the FHIR API access token in order to call the FHIR API.
- `getPatientFHIRData`: Getting the patient's medications and allergies from the FHIR API.
- `getPatientVisit`: Get information about a specific visit, including the patient's mood, taken medications, and symptomes.
- `supabaseAdmin`: Creates a service role supabase client.
- `supabaseClient`: Creates a supabase client using the user's JWT token.

## Deployment

In order to deploy this backend, please reffer to Supabase's documentation [on how to deploy edge functions to production](https://supabase.com/docs/guides/functions/deploy).

## Built With
- TypeScript
- Supabase
- Deno