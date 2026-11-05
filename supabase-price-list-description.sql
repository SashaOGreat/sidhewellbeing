-- Add optional description to price list rows
alter table public.price_list_items
  add column if not exists description text not null default '';
