import { POLICIES } from './data/mock';

export type FormState = {
  policyId: string | null;
  guaranteeType: string | null;
  service: string | null;
  comment: string;
  specialist: string | null;
  clinic: string | null;
  doctorName: string;
  files: File[];
};

export const EMPTY_FORM: FormState = {
  policyId: POLICIES[0]?.id ?? null,
  guaranteeType: null,
  service: null,
  comment: '',
  specialist: null,
  clinic: null,
  doctorName: '',
  files: []
};

export const STEP_TITLES: Record<string, string> = {
  surgery: 'მიმართვა ქირურგიული ოპერაციისთვის',
  medication_sms: 'მიმართვა მედიკამენტების მისაღებად',
  consultation: 'მიმართვა ექიმთან კონსულტაციისთვის',
  prophylactic: 'მიმართვა პროფილაქტიკური კვლევებისთვის'
};
