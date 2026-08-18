-- Inline SVG icon for a category (admin pastes the SVG source).
alter table public.categories
  add column if not exists icon_svg text;

comment on column public.categories.icon_svg is 'Optional inline SVG code (category icon)';
