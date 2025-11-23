# Rice Mill Management System

A comprehensive full-stack Rice Mill Management System built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- ✅ **Authentication** - Secure login system
- ✅ **Dashboard** - Overview with key metrics and statistics
- ✅ **Paddy Purchase Management** - Track all paddy purchases with CRUD operations
- ✅ **Production/Milling** - Monitor rice production with automatic yield calculation
- ✅ **Sales Management** - Comprehensive sales tracking with multiple payment types
  - Cash Sales
  - Loan Sales (with paid/unpaid status)
  - Bank Transfer Sales
- ✅ **Expense Tracking** - Categorized expense management
- ✅ **Month Filtering** - Global month filter across all modules
- ✅ **CSV Export** - Export data for all modules
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Real-time Data** - Powered by Supabase

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query
- **Tables:** TanStack Table
- **Forms:** React Hook Form + Zod
- **UI Components:** Headless UI
- **Icons:** Lucide React
- **Routing:** React Router v6

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/rice-mill-management.git
cd rice-mill-management
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com)
   - Go to SQL Editor and run the database schema (see `database-schema.sql`)
   - Copy your project URL and anon key to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173)

## 📱 Screenshots

[Add screenshots here]

## 🗄️ Database Schema

The system uses 4 main tables:
- `purchases` - Paddy purchase records
- `production` - Rice production/milling records
- `sales` - Sales transactions
- `expenses` - Expense records

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Developer

Developed by [Your Name]