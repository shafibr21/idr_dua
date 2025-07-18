-- Insert sample categories
INSERT INTO categories (name, name_en, subcategories_count, duas_count, icon) VALUES
('أهمية الدعاء', 'Dua''s Importance', 7, 21, '📖'),
('فضل الدعاء', 'Dua''s Excellence', 1, 13, '⭐'),
('وقت الدعاء', 'Time of Dua', 1, 29, '🕐'),
('قبول الدعاء', 'Dua Acceptance', 1, 14, '✅');

-- Insert sample subcategories
INSERT INTO subcategories (category_id, name, name_en, duas_count) VALUES
(1, 'العبد محتاج إلى ربه', 'The servant is dependent on his Lord', 3),
(1, 'أهم ما يسأل الله', 'The most important thing to ask Allah for', 4),
(1, 'طلب الجنة والعياذ من النار', 'Ask for paradise & protection from fire', 5),
(1, 'دعاء الثبات على الدين', 'Dua to remain steadfast on the religion', 3),
(1, 'دعاء حسن الخاتمة في جميع الأعمال', 'Dua of good outcome in all deeds', 3),
(1, 'طلب ما عند الله من الخير', 'Seeking whatever good Allah can bestow', 2),
(1, 'الاستعاذة من الهول والمحن وسوء العواقب وشماتة الأعداء', 'Shelter from horror, misery, evil consequences and rejoicing the enemy', 1);

-- Insert sample duas
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
'Sahih Bukhari');
