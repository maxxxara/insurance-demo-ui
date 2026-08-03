import { zipSync } from 'fflate';
import { MAX_TOTAL_BYTES, MAX_TOTAL_MB } from '../data/mock';

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api`;

export type ReferralSource = 'IMEDI_L_WEB' | 'IMEDI_L_APP' | 'HP_PORTAL';

export type ReferralMetadata = {
  source: ReferralSource;
  patient: {
    name: string;
    nationalId: string;
    dob: string;
    phone?: string;
  };
  clinicName: string;
  comment?: string;
  recentReferrals?: string;
};

export type ReferralVerdict = 'PENDING' | 'PASSED' | 'FAILED';

export type ReferralItem = {
  id: string;
  index: number;
  type: 'AMBULATORY' | 'MEDICATION';
  fields: Record<string, unknown> | null;
  verdict: ReferralVerdict;
  failureReason?: string | null;
};

export type ReferralValidation = {
  step: string;
  status: 'pass' | 'fail';
  reason?: string;
};

export type ReferralRequestStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type ReferralRequestResult = {
  requestId: string;
  status: ReferralRequestStatus;
  source: ReferralSource;
  extraction: Record<string, unknown> | null;
  clinicName: string | null;
  validations: ReferralValidation[] | null;
  referrals: ReferralItem[];
  processingError?: string | null;
};

/** One row of the history list; the full result is fetched per request id. */
export type ReferralSummary = {
  requestId: string;
  status: ReferralRequestStatus;
  source: ReferralSource;
  clinicName: string | null;
  patientName: string | null;
  referralCount: number;
  createdAt: string;
};

export type ReferralList = {
  total: number;
  limit: number;
  offset: number;
  items: ReferralSummary[];
};

const readFile = (file: File) =>
  new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`ფაილის წაკითხვა ვერ მოხერხდა: ${file.name}`));
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(file);
  });

export const zipFiles = async (files: File[]): Promise<Blob> => {
  const entries: Record<string, Uint8Array> = {};
  const used = new Set<string>();

  for (const file of files) {
    let name = file.name.replace(/[/\\]/g, '_');
    let i = 1;
    while (used.has(name)) {
      const dot = name.lastIndexOf('.');
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : '';
      name = `${stem}-${i++}${ext}`;
    }
    used.add(name);
    entries[name] = await readFile(file);
  }

  const zipped = zipSync(entries, { level: 6 });
  return new Blob([zipped as unknown as BlobPart], { type: 'application/zip' });
};

const parseError = async (response: Response) => {
  try {
    const body = await response.json();
    return body?.error?.message ?? `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

export const createReferral = async (
  metadata: ReferralMetadata,
  files: File[],
  signal?: AbortSignal
): Promise<ReferralRequestResult> => {
  const zip = await zipFiles(files);

  if (zip.size > MAX_TOTAL_BYTES) {
    throw new Error(`არქივის ზომა აღემატება ${MAX_TOTAL_MB} მბ-ს`);
  }

  const form = new FormData();
  form.append('documents', zip, 'documents.zip');
  form.append('metadata', JSON.stringify(metadata));

  const response = await fetch(`${API_BASE}/referrals`, {
    method: 'POST',
    body: form,
    signal
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const listReferrals = async (
  signal?: AbortSignal,
  limit = 50
): Promise<ReferralList> => {
  const response = await fetch(`${API_BASE}/referrals?limit=${limit}`, {
    signal
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const getReferral = async (
  id: string,
  signal?: AbortSignal
): Promise<ReferralRequestResult> => {
  const response = await fetch(`${API_BASE}/referrals/${id}`, { signal });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ORIGIN}/health`, {
      signal: AbortSignal.timeout(2500)
    });
    return response.ok;
  } catch {
    return false;
  }
};
