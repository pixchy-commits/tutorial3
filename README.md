# ExpenseTracker - Feature-Rich Expense & Revenue Tracker

A modern, full-featured expense and revenue tracking application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure signup/signin with email or Google OAuth
- **Expense & Revenue Tracking** - Add, edit, delete transactions with detailed categorization
- **Categories & Subcategories** - Organized transaction categorization with custom icons and colors
- **Advanced Filtering** - Filter by type, category, date range, amount, and search terms
- **Tags System** - Tag transactions for better organization
- **Payment Methods** - Track different payment methods

### Analytics & Visualization
- **Dashboard with Charts** - Interactive pie charts, line charts, and bar charts
- **Monthly Trends** - Track expenses, revenue, and profit over time
- **Category Breakdowns** - Visual representation of spending by category
- **Financial Summary** - Key metrics like total expenses, revenue, net profit

### Data Management
- **Export to CSV** - Export your transaction data
- **Import Data** - Import transactions from CSV/JSON files
- **Cloud Sync** - All data synced to Supabase cloud database
- **Responsive Design** - Works perfectly on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd tutorial3
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API to get your project URL and anon key
3. Copy the SQL migration from `supabase/migrations/001_initial_schema.sql`
4. Go to the SQL Editor in your Supabase dashboard and run the migration

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configure Authentication (Optional)

To enable Google OAuth:
1. Go to Authentication > Providers in your Supabase dashboard
2. Configure Google provider with your OAuth credentials
3. Add your site URL to the redirect URLs

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- **categories** - Expense and revenue categories with icons and colors
- **transactions** - Individual transactions with full details
- **budgets** - Budget tracking per category (future feature)
- **user_profiles** - Extended user profile information

All tables include Row Level Security (RLS) to ensure users can only access their own data.

## 🔐 Security Features

- **Row Level Security** - Database-level security ensuring data isolation
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Client and server-side validation
- **SQL Injection Protection** - Parameterized queries via Supabase

## 🎨 User Interface

- **Clean, Modern Design** - Professional interface with intuitive navigation
- **Responsive Layout** - Works seamlessly on all device sizes
- **Dark/Light Mode Ready** - Built with Tailwind CSS for easy theming
- **Accessibility** - Semantic HTML and keyboard navigation support

## 📱 Mobile Features

- **Touch-Friendly Interface** - Optimized for mobile interactions
- **Responsive Tables** - Horizontal scrolling for transaction lists
- **Mobile-First Design** - Designed for mobile and scaled up

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `.next`
4. Add your environment variables

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── data/               # Static data and constants
```

### Key Components
- **AuthForm** - Authentication interface
- **Dashboard** - Analytics and charts view
- **TransactionForm** - Add/edit transaction modal
- **TransactionList** - Filterable transaction table
- **Navigation** - Main navigation with user menu

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that your Supabase configuration is correct
2. Ensure all environment variables are set
3. Verify the database migration was run successfully
4. Check the browser console for any error messages

For additional help, please open an issue in the repository.
