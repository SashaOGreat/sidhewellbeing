-- CTA migration for content blocks (jsonb data)
-- Adds missing cta_label and cta_url keys to existing records.
-- Run once in the Supabase SQL editor.

update public.content_blocks
set data =
  jsonb_set(
    jsonb_set(data, '{cta_label}', to_jsonb(coalesce(data->>'cta_label', '')), true),
    '{cta_url}',
    to_jsonb(coalesce(data->>'cta_url', '')),
    true
  )
where block_type <> 'grid'
  and (
    not (data ? 'cta_label')
    or not (data ? 'cta_url')
  );

update public.reusable_section_nodes
set data =
  jsonb_set(
    jsonb_set(data, '{cta_label}', to_jsonb(coalesce(data->>'cta_label', '')), true),
    '{cta_url}',
    to_jsonb(coalesce(data->>'cta_url', '')),
    true
  )
where block_type <> 'grid'
  and (
    not (data ? 'cta_label')
    or not (data ? 'cta_url')
  );
