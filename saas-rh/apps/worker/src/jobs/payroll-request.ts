import type { Job } from 'bullmq';
export async function payrollRequest(job: Job) {
  // Lee periodo, genera planilla, encola vouchers por empleado
  console.log('Payroll requested', job.data);
}