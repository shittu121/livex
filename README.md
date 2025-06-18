# Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**

```bash
git clone https://github.com/JustineSimbajon/liveX-Dashboard-New.git
cd liveX-Dashboard-New
```

## 2. Add environment variables

Create a `.env.local` file in the root directory and add the following:

```env

NEXT_PUBLIC_SUPABASE_URL=get it from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=get it from Supabase Dashboard
```

## Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Add your Supabase Project URL and `anon` key to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📄 Create Table: `profiles`

The `profiles` table extends the default Supabase `auth.users` table to store additional user information such as role and email.

### Table Structure

| Column Name | Type        | Default     | Constraints                 | Description                             |
|-------------|-------------|-------------|-----------------------------|-----------------------------------------|
| `id`        | `uuid`      | —           | Primary Key, Foreign Key    | References `auth.users.id`              |
| `created_at`| `timestamptz` | `now()`    | —                           | Timestamp of when the profile was created |
| `role`      | `text`      | —           | —                           | User's role in the application (e.g., `admin`, `brand`, `influencer`) |
| `email`     | `text`      | —           | —                           | User's email address                    |

### Relationships

- 🔗 `id` is a foreign key referencing `auth.users.id`, ensuring each profile is tied to a valid authenticated user.

## 🔐 Auth Policies for `profiles`

### 🔧 Row Level Security (RLS)
- ✅ **RLS Enabled** — Row Level Security is active for the `profiles` table.

### 📝 Policies

#### ➕ INSERT

- **Allow Users To Insert When Not Authenticated**  
  - 👥 **Role**: `public`  
  - ✅ **Effect**: Allows unauthenticated users to insert data into `profiles`.

- **Enable Insert for Authenticated Users Only**  
  - 👥 **Role**: `authenticated`  
  - ✅ **Effect**: Allows only authenticated users to insert data into `profiles`.

#### 📄 SELECT

- **Enable Read Access for All Users**  
  - 👥 **Role**: `public`  
  - ✅ **Effect**: Allows all users (authenticated or not) to read data from `profiles`.


## 🗂️ Create Table: `sessions`

This table stores individual user sessions linked to the `profiles` table.

### 📦 Structure

| Column Name | Data Type       | Description                                                                 |
|-------------|------------------|-----------------------------------------------------------------------------|
| `id`        | `uuid`           | Primary key. Automatically generated using `uuid_generate_v4()`.           |
| `user_id`   | `uuid`           | References `profiles(id)`. Identifies the user the session belongs to.     |
| `created_at`| `timestamptz`    | Timestamp of when the session was created. Defaults to `now()`.            |

### 🔗 Relationships

- `user_id` is a foreign key that links each session to a specific user in the `profiles` table.

### 🛡️ Notes

- The `id` column uses `uuid_generate_v4()` to create a unique session identifier.
- The `created_at` field uses the current timestamp to mark when a session is created.



### 3. Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 4. Run the development server

Start the development server by running:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

## 🛠 Tech Stack

- **Next.js**
- **TypeScript**
- **Supabase**
- **Tailwind CSS**
- **Framer Motion**


---

## 🧠 Features

- ✅ Supabase authentication
- ✅ Role-based route protection
- ✅ Responsive UI with Tailwind CSS
- ✅ Server-side authentication with Supabase SSR
- ✅ Font optimization using [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) and [Geist](https://vercel.com/font)

---



