-- Tenancy base
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  employee_code text not null,
  dni text not null,
  name text not null
);
create index if not exists idx_emp_company on employees(company_id);
create index if not exists idx_emp_dni_last5 on employees (right(dni,5));

create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  created_at timestamptz default now()
);
create unique index if not exists uq_att_unique on attendance_records(employee_id, work_date);
create index if not exists idx_att_company_date on attendance_records(company_id, work_date);

-- Auth helper: require company_id claim in JWT
alter table employees enable row level security;
alter table attendance_records enable row level security;

create policy "employees_by_company"
  on employees for select using (company_id::text = auth.jwt() ->> 'company_id');
create policy "employees_ins_same_company"
  on employees for insert with check (company_id::text = auth.jwt() ->> 'company_id');
create policy "attendance_by_company"
  on attendance_records for select using (company_id::text = auth.jwt() ->> 'company_id');
create policy "attendance_ins_same_company"
  on attendance_records for insert with check (company_id::text = auth.jwt() ->> 'company_id');

-- RPC: create_attendance (SECURITY DEFINER)
create or replace function create_attendance(
  p_employee_code text,
  p_check_type text,
  p_ts timestamptz
) returns json language plpgsql security definer as $$
begin
  -- Suponemos company_id viene del JWT del usuario anon con un edge policy previa
  -- En Supabase, podés mapear una "public company" o validar por IP/geofence (extensión)
  perform 1; -- placeholder para validaciones adicionales
  return json_build_object('ok', true);
end; $$;

revoke all on function create_attendance(text,text,timestamptz) from public;
grant execute on function create_attendance(text,text,timestamptz) to anon;