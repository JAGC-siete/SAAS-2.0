import type { Job } from 'bullmq';
import { createServiceClient } from '@saas-rh/utils';

export async function voucherGenerate(job: Job) {
  const supabase = createServiceClient();
  // TODO: generar PDF (ej. pdfkit) y guardar metadata en tabla files
  // Nota: esta ruta corre en worker, no expone service role a público
  console.log('Generating voucher', job.data);
}