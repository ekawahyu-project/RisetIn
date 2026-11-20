-- RisetIn PostgreSQL Schema (Neon / Supabase Postgres / standard Postgres 15+)
-- Idempotent: safe to run multiple times.

create table if not exists users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('mahasiswa', 'industri')),
  nama text not null,
  inisial text not null,
  kampus text,
  sektor text,
  bio text not null default '',
  nim text,
  nib text,
  telp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists riset (
  id bigint generated always as identity primary key,
  author_id bigint not null references users(id) on delete cascade,
  judul text not null,
  kampus text not null,
  kategori text not null check (kategori in ('pertanian', 'teknologi', 'manufaktur', 'kesehatan', 'lingkungan', 'energi')),
  lisensi text,
  views integer not null default 0 check (views >= 0),
  base_likes integer not null default 0 check (base_likes >= 0),
  diadopsi integer not null default 0 check (diadopsi >= 0),
  tahap text not null default 'Gagasan murni',
  status text not null default 'diterbitkan' check (status in ('diterbitkan', 'diadopsi', 'draf', 'arsip')),
  img text not null default 'lms',
  img_url text,
  ringkasan text not null default '',
  manfaat text[] not null default '{}',
  dokumen jsonb not null default '[]'::jsonb,
  anggota jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists riset_author_id_idx on riset (author_id);
create index if not exists riset_status_kategori_idx on riset (status, kategori);
create index if not exists riset_created_at_idx on riset (created_at desc);

create table if not exists riset_likes (
  riset_id bigint not null references riset(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (riset_id, user_id)
);

create index if not exists riset_likes_user_id_idx on riset_likes (user_id);

create table if not exists comments (
  id bigint generated always as identity primary key,
  riset_id bigint not null references riset(id) on delete cascade,
  user_id bigint references users(id) on delete set null,
  author_name text not null,
  author_inisial text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_riset_id_created_idx on comments (riset_id, created_at asc);
create index if not exists comments_user_id_idx on comments (user_id);

create table if not exists collaborations (
  id bigint generated always as identity primary key,
  riset_id bigint not null references riset(id) on delete cascade,
  industri_id bigint not null references users(id) on delete cascade,
  mahasiswa_id bigint not null references users(id) on delete cascade,
  pesan text not null default '',
  status text not null default 'menunggu' check (status in ('menunggu', 'diterima', 'ditolak')),
  tahap smallint not null default 0 check (tahap between 0 and 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collaborations_riset_id_idx on collaborations (riset_id);
create index if not exists collaborations_industri_id_status_idx on collaborations (industri_id, status);
create index if not exists collaborations_mahasiswa_id_status_idx on collaborations (mahasiswa_id, status);

create table if not exists nda_agreements (
  id bigint generated always as identity primary key,
  collaboration_id bigint not null unique references collaborations(id) on delete cascade,
  nomor_nda text not null unique,
  signer_id bigint not null references users(id) on delete cascade,
  signer_nama text not null,
  signer_jabatan text not null,
  signature_data text not null,
  signed_at timestamptz not null default now()
);

create index if not exists nda_agreements_signer_id_idx on nda_agreements (signer_id);

create table if not exists messages (
  id bigint generated always as identity primary key,
  collaboration_id bigint not null references collaborations(id) on delete cascade,
  sender_id bigint not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_collab_created_idx on messages (collaboration_id, created_at asc);
create index if not exists messages_sender_id_idx on messages (sender_id);

create table if not exists notifications (
  id bigint generated always as identity primary key,
  user_id bigint not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'info' check (type in ('success', 'info', 'chat', 'request')),
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx on notifications (user_id, created_at desc);

-- Lock down direct public PostgREST access (important on Supabase):
-- Express connects via the postgres role (BYPASSRLS), while anon/authenticated Data API clients are blocked by default.
alter table users enable row level security;
alter table riset enable row level security;
alter table riset_likes enable row level security;
alter table comments enable row level security;
alter table collaborations enable row level security;
alter table nda_agreements enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

