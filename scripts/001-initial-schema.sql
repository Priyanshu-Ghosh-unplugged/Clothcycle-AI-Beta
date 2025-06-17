-- ClothCycle AI Database Schema
-- Run this script to set up the initial database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends NextAuth users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  wallet_address VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table (clothing items)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(10,2) DEFAULT 0,
  is_donation BOOLEAN DEFAULT false,
  category VARCHAR(100),
  size VARCHAR(50),
  brand VARCHAR(100),
  condition VARCHAR(50),
  eco_score INTEGER DEFAULT 0,
  ai_tags TEXT[],
  status VARCHAR(50) DEFAULT 'available', -- available, sold, donated, removed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled, refunded
  transaction_type VARCHAR(50) NOT NULL, -- donation, sale
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees configuration table
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_fee_percentage DECIMAL(5,2) DEFAULT 5.00,
  default_delivery_fee DECIMAL(10,2) DEFAULT 5.99,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default fee structure
INSERT INTO fees (platform_fee_percentage, default_delivery_fee) 
VALUES (5.00, 5.99);

-- Indexes for better performance
CREATE INDEX idx_posts_owner_id ON posts(owner_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_is_donation ON posts(is_donation);
CREATE INDEX idx_transactions_post_id ON transactions(post_id);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view available posts
CREATE POLICY "Anyone can view available posts" ON posts
  FOR SELECT USING (status = 'available');

-- Users can create their own posts
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = owner_id);

-- Users can view transactions they're involved in
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can create transactions for available posts
CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE id = post_id 
      AND status = 'available'
      AND (auth.uid() = buyer_id OR buyer_id IS NULL)
    )
  );
