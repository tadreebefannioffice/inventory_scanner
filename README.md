# 📦 Inventory Scanner System

A complete inventory management system using QR codes, GitHub Pages, and Supabase.

## Features
- 📱 Scan QR codes with any smartphone camera
- 🏷️ Generate QR codes for any equipment in bulk
- 📊 Dashboard to view all inventory items
- 🔄 Register new items instantly
- ✏️ Update item details on the fly

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Hosting:** GitHub Pages (free)
- **Database:** Supabase (free PostgreSQL)
- **QR Scanner:** html5-qrcode library

## Setup Instructions

### 1. Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run this SQL in the SQL Editor:
   ```sql
   CREATE TABLE items (
       id BIGSERIAL PRIMARY KEY,
       unique_id TEXT UNIQUE NOT NULL,
       category TEXT,
       serial_number TEXT,
       assigned_to TEXT,
       location TEXT,
       status TEXT DEFAULT 'unregistered',
       quantity INTEGER DEFAULT 1,
       registered_at TIMESTAMP DEFAULT NOW()
   );
