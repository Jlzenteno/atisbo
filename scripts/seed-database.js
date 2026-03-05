require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son necesarios en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('--- Iniciando Seeding de Base de Datos ---');

  const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/seed-data.json'), 'utf8'));

  // 1. Limpiar datos existentes (Opcional, pero recomendado para un seed limpio)
  // console.log('Limpiando tablas...');
  // await supabase.from('comunas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // await supabase.from('regions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Insertar Regiones
  console.log(`Insertando ${seedData.regions.length} regiones...`);
  const regionMap = {};

  for (const region of seedData.regions) {
    const { data, error } = await supabase
      .from('regions')
      .upsert({
        name: region.name,
        slug: region.slug,
        description: region.description,
        visited: region.visited
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Error procesando región ${region.name}:`, error.message);
      // Try to fetch it if upsert failed due to conflict but didn't return data
      const { data: existing } = await supabase.from('regions').select('id').eq('slug', region.slug).single();
      if (existing) regionMap[region.id] = existing.id;
    } else {
      regionMap[region.id] = data.id;
    }
  }

  // 3. Insertar Comunas
  console.log(`Insertando ${seedData.comunas.length} comunas...`);
  const comunasToInsert = seedData.comunas.map(comuna => ({
    name: comuna.name,
    slug: comuna.slug,
    region_id: regionMap[comuna.region_id],
    visited: comuna.visited,
    cover_image: comuna.image_cover // Asegúrate de que el campo en SQL sea cover_image o image_url
  }));

  // Insertar en bloques para evitar límites de payload
  const chunkSize = 50;
  for (let i = 0; i < comunasToInsert.length; i += chunkSize) {
    const chunk = comunasToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('comunas').upsert(chunk);
    
    if (error) {
      console.error(`Error insertando bloque de comunas starting at ${i}:`, error.message);
    } else {
      console.log(`Insertado bloque de comunas ${i} a ${i + chunk.length}`);
    }
  }

  console.log('--- Seeding completado con éxito ---');
}

seed().catch(err => {
  console.error('Error fatal durante el seeding:', err);
  process.exit(1);
});
