import { Worker } from 'bullmq';
import { bullConnection } from '@saas-rh/utils';
import { voucherGenerate } from './jobs/voucher-generate';
import { payrollRequest } from './jobs/payroll-request';

new Worker('voucher', voucherGenerate, { connection: bullConnection });
new Worker('payroll', payrollRequest, { connection: bullConnection });

console.log('Workers running');