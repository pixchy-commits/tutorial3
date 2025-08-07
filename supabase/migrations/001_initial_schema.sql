-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('expense', 'revenue')),
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    subcategories TEXT[], -- Array of subcategory names
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('expense', 'revenue')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL, -- Store category name for historical data
    subcategory VARCHAR(255),
    date DATE NOT NULL,
    tags TEXT[], -- Array of tags
    payment_method VARCHAR(100),
    recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(50) CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    category_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    period VARCHAR(50) NOT NULL CHECK (period IN ('monthly', 'yearly')),
    alert_threshold DECIMAL(5, 2) CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for additional user data
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Users can view their own categories" ON categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can view their own budgets" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON budgets
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default categories for new users (optional, you can also do this in the app)
-- This function will be called when a user first accesses the app
CREATE OR REPLACE FUNCTION create_default_categories_for_user(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Insert default expense categories
    INSERT INTO categories (user_id, name, type, color, icon, subcategories) VALUES
    (user_uuid, 'Food & Dining', 'expense', '#ef4444', '🍽️', ARRAY['Restaurants', 'Groceries', 'Coffee', 'Fast Food', 'Alcohol']),
    (user_uuid, 'Transportation', 'expense', '#3b82f6', '🚗', ARRAY['Gas', 'Public Transit', 'Parking', 'Maintenance', 'Insurance']),
    (user_uuid, 'Shopping', 'expense', '#8b5cf6', '🛍️', ARRAY['Clothing', 'Electronics', 'Home & Garden', 'Books', 'Gifts']),
    (user_uuid, 'Entertainment', 'expense', '#ec4899', '🎬', ARRAY['Movies', 'Games', 'Music', 'Sports', 'Hobbies']),
    (user_uuid, 'Bills & Utilities', 'expense', '#f59e0b', '⚡', ARRAY['Electricity', 'Water', 'Internet', 'Phone', 'Insurance']),
    (user_uuid, 'Healthcare', 'expense', '#10b981', '🏥', ARRAY['Doctor', 'Pharmacy', 'Insurance', 'Dental', 'Vision']),
    (user_uuid, 'Education', 'expense', '#6366f1', '📚', ARRAY['Tuition', 'Books', 'Courses', 'Supplies', 'Training']),
    (user_uuid, 'Travel', 'expense', '#14b8a6', '✈️', ARRAY['Flights', 'Hotels', 'Car Rental', 'Food', 'Activities']);

    -- Insert default revenue categories
    INSERT INTO categories (user_id, name, type, color, icon, subcategories) VALUES
    (user_uuid, 'Salary', 'revenue', '#22c55e', '💼', ARRAY['Base Salary', 'Bonus', 'Overtime', 'Commission']),
    (user_uuid, 'Business', 'revenue', '#3b82f6', '🏢', ARRAY['Sales', 'Services', 'Consulting', 'Products']),
    (user_uuid, 'Investments', 'revenue', '#8b5cf6', '📈', ARRAY['Dividends', 'Interest', 'Capital Gains', 'Crypto']),
    (user_uuid, 'Freelance', 'revenue', '#f59e0b', '💻', ARRAY['Projects', 'Hourly Work', 'Contracts', 'Royalties']),
    (user_uuid, 'Rental', 'revenue', '#06b6d4', '🏠', ARRAY['Property Rent', 'Equipment Rental', 'Vehicle Rental']),
    (user_uuid, 'Other', 'revenue', '#84cc16', '💰', ARRAY['Gifts', 'Refunds', 'Cashback', 'Side Hustle']);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
