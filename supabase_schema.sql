-- =========================================================================
-- AURA LUXE — POS & Personal Style Studio
-- Supabase PostgreSQL Database Schema & Initial Seeds
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('cash', 'promptpay', 'credit_card', 'transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('paid', 'pending', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'member',
    phone TEXT,
    avatar_url TEXT,
    personal_color TEXT,
    face_shape TEXT,
    body_shape TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SERVICES & PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS public.services_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'service', 'makeup', 'apparel', 'package'
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost NUMERIC(10, 2) DEFAULT 0.00,
    description TEXT,
    duration_mins INT DEFAULT 30,
    in_stock INT DEFAULT 100,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS (POS Transactions)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL DEFAULT 'ลูกค้าทั่วไป (Walk-in)',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method payment_method_type DEFAULT 'promptpay',
    status order_status_type DEFAULT 'paid',
    cashier_name TEXT DEFAULT 'Admin Staff',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.services_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CONSULTATIONS & STYLE ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    undertone TEXT, -- 'Warm', 'Cool', 'Neutral', 'Olive'
    season TEXT, -- 'Spring', 'Summer', 'Autumn', 'Winter'
    sub_season TEXT, -- 'Light Spring', 'Warm Autumn', etc.
    face_shape TEXT, -- 'Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'
    recommended_hairstyles JSONB,
    body_shape TEXT, -- 'Hourglass', 'Pear', 'Rectangle', 'Inverted Triangle', 'Apple'
    measurements JSONB, -- {bust: 34, waist: 26, hip: 36}
    occasion_recommendations JSONB,
    consultant_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. USAGE & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    role user_role DEFAULT 'member',
    action_type TEXT NOT NULL, -- 'login', 'pos_checkout', 'color_check', 'face_check', 'body_check'
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo & development (Can be restricted in production)
CREATE POLICY "Public profiles read policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles insert policy" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public profiles update policy" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public services read policy" ON public.services_products FOR SELECT USING (true);
CREATE POLICY "Public services write policy" ON public.services_products FOR ALL USING (true);

CREATE POLICY "Public orders policy" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public order items policy" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Public consultations policy" ON public.consultations FOR ALL USING (true);
CREATE POLICY "Public usage logs policy" ON public.usage_logs FOR ALL USING (true);

-- 10. PRE-SEEDED DATA FOR STUDIO
INSERT INTO public.profiles (email, full_name, role, phone, personal_color, face_shape, body_shape)
VALUES 
('admin@auraluxe.com', 'Aura Luxe Manager', 'admin', '081-234-5678', 'Autumn Warm', 'Oval', 'Hourglass'),
('member@example.com', 'คุณพิมลดา สุขใจ', 'member', '089-876-5432', 'Light Spring', 'Round', 'Pear')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.services_products (name, category, price, description, duration_mins, in_stock, image_url)
VALUES 
('วิเคราะห์ Personal Color แบบละเอียด (Drape Test 12 Seasons)', 'service', 1890.00, 'บริการวิเคราะห์เทียบผ้า 120 เฉดสี พร้อมเล่มสีประจำตัวและไกด์เครื่องสำอาง', 60, 999, 'assets/studio_banner.jpg'),
('วิเคราะห์รูปหน้า + ออกแบบทรงผมเฉพาะบุคคล', 'service', 1290.00, 'วัดสัดส่วนใบหน้า 3 มิติ แนะนำทรงผม หน้าม้า และแว่นตาที่ขับโครงหน้า', 45, 999, 'assets/studio_banner.jpg'),
('วิเคราะห์สรีระ + ให้คำปรึกษาแต่งตัวตามโอกาส & เทศกาล', 'service', 1590.00, 'คำนวณ Body Shape แนะนำสไตล์เสื้อผ้า พรางหุ่น และชุดไปงานต่างๆ', 45, 999, 'assets/studio_banner.jpg'),
('Full VIP Image Makeover Package (ตรวจสี + ทรงผม + เสื้อผ้า)', 'package', 3990.00, 'แพ็กเกจปรับลุคครบวงจร 3 ชั่วโมงเต็ม พร้อม Personal Color Book ดิจิทัล', 180, 999, 'assets/studio_banner.jpg'),
('AURA Velvet Matte Lipstick - Spring Coral (#01)', 'makeup', 590.00, 'ลิปสติกเนื้อแมตต์นุ่ม โทนคอรัลสดใส เหมาะกับสาว Warm Spring', 0, 50, 'assets/studio_banner.jpg'),
('AURA Velvet Matte Lipstick - Summer Rose (#02)', 'makeup', 590.00, 'ลิปสติกโทนชมพูกลีบกุหลาบละมุน ขับผิว Cool Summer', 0, 45, 'assets/studio_banner.jpg'),
('AURA Velvet Matte Lipstick - Autumn Brick (#03)', 'makeup', 590.00, 'ลิปสติกโทนส้มอิฐอมน้ำตาลเข้ม สำหรับสาว Warm Autumn', 0, 38, 'assets/studio_banner.jpg'),
('AURA Velvet Matte Lipstick - Winter Burgundy (#04)', 'makeup', 590.00, 'ลิปสติกโทนไวน์แดงเบอร์กันดี ทรงเสน่ห์สำหรับ Cool Winter', 0, 25, 'assets/studio_banner.jpg'),
('AURA 9-Color Eyeshadow Palette - Warm Earthy', 'makeup', 950.00, 'พาเลทอายแชโดว์เนื้อเนียน โทนน้ำตาลทอง คอปเปอร์ พีช', 0, 30, 'assets/studio_banner.jpg'),
('AURA 9-Color Eyeshadow Palette - Cool Mauve', 'makeup', 950.00, 'พาเลทอายแชโดว์โทนชมพูอมม่วง เทา แอชชี่ สำหรับ Cool Tone', 0, 28, 'assets/studio_banner.jpg'),
('เซ็ตต่างหูและสร้อยคอขับผิว (Warm Gold Accent)', 'apparel', 790.00, 'เครื่องประดับชุบทองคำ 18K ช่วยขับออร่าผิว Warm Tone', 0, 20, 'assets/studio_banner.jpg'),
('เซ็ตต่างหูและสร้อยคอขับผิว (Cool Platinum Silver)', 'apparel', 790.00, 'เครื่องประดับสีเงินแพลตตินัม ดีไซน์หรูหราสำหรับ Cool Tone', 0, 22, 'assets/studio_banner.jpg');
