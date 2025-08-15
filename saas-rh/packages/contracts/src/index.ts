import { z } from 'zod';
export const AttendanceCreate = z.object({ employee_code: z.string(), check_type: z.enum(['IN','OUT']), ts: z.string().datetime() });
export const PayrollRequest = z.object({ period_start: z.string().date(), period_end: z.string().date(), type: z.enum(['Q1','Q2','MONTH']) });
export type AttendanceCreate = z.infer<typeof AttendanceCreate>;
export type PayrollRequest = z.infer<typeof PayrollRequest>;