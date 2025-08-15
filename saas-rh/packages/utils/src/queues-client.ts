import { Queue } from 'bullmq';
import { bullConnection } from './redis-bull.js';

let _queues: { voucher: Queue; payroll: Queue } | null = null;
function getQueues() {
  if (_queues) return _queues;
  _queues = {
    voucher: new Queue('voucher', { connection: bullConnection }),
    payroll: new Queue('payroll', { connection: bullConnection }),
  };
  return _queues;
}

export const queues = new Proxy({} as { voucher: Queue; payroll: Queue }, {
  get(_target, prop: 'voucher' | 'payroll') {
    return getQueues()[prop];
  }
});