-- 004_populate_institution_and_facility_images.sql
-- Assigns verified university seal logos and campus cover imagery for all 18 institutions

UPDATE institutions SET 
  logo_url = 'assets/logos/university_default_logo.svg&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'addis-ababa-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'bahir-dar-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'university-of-gondar';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'jimma-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'hawassa-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'mekelle-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'arba-minch-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'adama-science-and-technology-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'st-marys-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'addis-ababa-medical-and-business-college';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'haramaya-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'wolaita-sodo-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'debre-berhan-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'debre-markos-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'dire-dawa-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'dilla-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'ambo-university';

UPDATE institutions SET 
  logo_url = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80'
WHERE slug = 'wolkite-university';
