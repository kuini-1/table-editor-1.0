# Table Editor

## Overview
The Table Editor is a robust platform designed for managing and editing over 60 game tables. With role-based access control, the system allows Owners to manage all aspects of the tables, including creating, updating, reading, and deleting data. Sub Owners can be assigned specific permissions, providing flexibility in managing the content. Stripe integration ensures Owners have access to premium features by securing their subscription.

## Features
- **Owner Role:** Full control over all tables, including the ability to manage CRUD operations and permissions for Sub Owners.
- **Sub Owner Role:** Limited access, with customizable permissions set by the Owner for each table.
- **60+ Game Tables:** Owners can manage over 60 different game tables, all with CRUD capabilities.
- **Stripe Integration:** Secure access to premium features through Stripe subscription.
- **Sub Owner Management:** Owners can create and manage Sub Owners to delegate table access.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key for client usage.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side operations.

## Local Development (pnpm)

### Prerequisites
- Node.js 20+
- Corepack enabled (`corepack enable`)

### Install
```bash
pnpm install
```

### Run
```bash
pnpm dev
```

### Build and Start
```bash
pnpm build
pnpm start
```