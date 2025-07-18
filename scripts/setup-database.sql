-- First, create the tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  subcategories_count INTEGER DEFAULT 0,
  duas_count INTEGER DEFAULT 0,
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  duas_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS duas (
  id SERIAL PRIMARY KEY,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  title_en VARCHAR(500) NOT NULL,
  arabic_text TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT NOT NULL,
  reference VARCHAR(255),
  audio_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_duas_subcategory_id ON duas(subcategory_id);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access on subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow public read access on duas" ON duas;

CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on duas" ON duas FOR SELECT USING (true);

-- Insert sample data
INSERT INTO categories (name, name_en, subcategories_count, duas_count, icon) VALUES
('أهمية الدعاء', 'Dua''s Importance', 7, 21, '📖'),
('فضل الدعاء', 'Dua''s Excellence', 1, 13, '⭐'),
('وقت الدعاء', 'Time of Dua', 1, 29, '🕐'),
('قبول الدعاء', 'Dua Acceptance', 1, 14, '✅')
ON CONFLICT (id) DO NOTHING;

INSERT INTO subcategories (category_id, name, name_en, duas_count) VALUES
(1, 'العبد محتاج إلى ربه', 'The servant is dependent on his Lord', 3),
(1, 'أهم ما يسأل الله', 'The most important thing to ask Allah for', 4),
(1, 'طلب الجنة والعياذ من النار', 'Ask for paradise & protection from fire', 5),
(1, 'دعاء الثبات على الدين', 'Dua to remain steadfast on the religion', 3),
(1, 'دعاء حسن الخاتمة في جميع الأعمال', 'Dua of good outcome in all deeds', 3),
(1, 'طلب ما عند الله من الخير', 'Seeking whatever good Allah can bestow', 2),
(1, 'الاستعاذة من الهول والمحن وسوء العواقب وشماتة الأعداء', 'Shelter from horror, misery, evil consequences and rejoicing the enemy', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO duas (subcategory_id, title, title_en, arabic_text, transliteration, translation, reference) VALUES
(1, 'نحن محتاجون إلى عون الله', 'We Are in Need of Allah''s Help (Surah Al-Fatir)', 
'يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ', 
'Yaa ayyuhan-naasu antumul-fuqaraa''u ilallaahi wallaahu huwal-ghaniyyul-hameed',
'All human beings depend on Allah for their welfare and prevention of evil in various matters of their religion and world. Allah says (interpretation of the meaning): O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy.',
'Surah Al-Fatir 35:15'),

(1, 'دعاء بعد الصلاة للرزق والعون', 'Dua After Prayer for Rizq and Help',
'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ۖ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۖ اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنفَعُ ذَا الْجَدِّ مِنكَ الْجَدُّ',
'Laa ilaaha illallahu wahdahu laa sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ''alaa kulli shay''in qadir. Allaahumma laa maani''a limaa a''tayta wa laa mu''tiya limaa mana''ta wa laa yanfa''u dhaal-jaddi minkal-jadd',
'Prophet (ﷺ) used to say after every compulsory prayer, The servant will ask his Lord for all of his religiously and worldly needs, because the treasure of all things is in the hands of Allah. Allah says (interpretation of the meaning): "And there is not a thing but that with Us are its depositories, and We do not send it down except according to a known measure." (Sura Al-Hijr 15:21) No one can withhold what Allah gives; And, no one can give what he resists.',
'Sahih Bukhari'),

(1, 'دعاء الاستعانة بالله', 'Seeking Help from Allah',
'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
'Rabbanaa aatinaa fi''d-dunyaa hasanatan wa fi''l-aakhirati hasanatan wa qinaa ''adhaab an-naar',
'Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire.',
'Surah Al-Baqarah 2:201')
ON CONFLICT (id) DO NOTHING;
