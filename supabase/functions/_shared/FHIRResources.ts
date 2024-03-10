// Defines interfaces for FHIR resources
export interface FHIRResource {
    resourceType: string;
  }
  
export interface MedicationAdministration extends FHIRResource {
    intent: string;
    status: string;
    medicationCodeableConcept?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    subject: {
      reference: string;
    };
}
  
  
export interface AllergyIntolerance extends FHIRResource {
    clinicalStatus?: {
      coding: Array<{
        system: string;
        code: string;
      }>;
    };
    verificationStatus?: {
      coding: Array<{
        system: string;
        code: string;
      }>;
    };
    type?: string;
    category?: Array<string>;
    criticality?: string;
    code: {
      coding: Array<{
        system: string;
        code: string;
        display?: string;
      }>;
    };
    patient: {
      reference: string;
    };
}