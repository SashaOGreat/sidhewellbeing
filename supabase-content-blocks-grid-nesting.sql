-- Grid + sub-blocks: parent_id, cell_index; root = grid, children = heading | text_block
-- Run in Supabase SQL after updating the code.
--
-- If you previously ran supabase-upgrade-content-blocks.sql, the table still has the old
-- CHECK for heading/text_block only — PostgreSQL often names it content_blocks_block_type_check.
-- Categories do not need to be deleted; this only affects this table.

alter table content_blocks drop constraint if exists content_blocks_block_type_check;
alter table content_blocks drop constraint if exists content_blocks_block_role;
alter table content_blocks drop constraint if exists content_blocks_parent_scope;
alter table content_blocks drop constraint if exists content_blocks_block_type_builtin;
alter table content_blocks drop constraint if exists content_blocks_parent;

alter table content_blocks
  add column if not exists parent_id uuid references content_blocks(id) on delete cascade;

alter table content_blocks
  add column if not exists cell_index integer not null default 0;

alter table content_blocks add constraint content_blocks_parent_scope check (
  (category_id is not null and subcategory_id is null) or
  (category_id is null and subcategory_id is not null)
);

alter table content_blocks add constraint content_blocks_block_role check (
  (parent_id is null and block_type = 'grid') or
  (
    parent_id is not null and block_type in (
      'heading',
      'text_block',
      'icon_heading_text',
      'image_heading_text_centered',
      'heading_text_image_right',
      'media_left_text_right'
    )
  )
);

create index if not exists idx_content_blocks_parent_id on content_blocks(parent_id);
