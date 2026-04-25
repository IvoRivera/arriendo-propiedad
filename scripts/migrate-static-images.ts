import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'carousel-images';

interface ImageMapping {
  src: string;
  alt: string;
  category: 'featured' | 'property' | 'amenities';
}

const imagesToMigrate: ImageMapping[] = [
  // FEATURED (Destacadas)
  { src: "/images/destacadas/01-living.webp", alt: "Vista del living y terraza", category: "featured" },
  { src: "/images/destacadas/02-cocina.webp", alt: "Cocina moderna equipada", category: "featured" },
  { src: "/images/destacadas/03-habitacion-principal.webp", alt: "Habitacin principal", category: "featured" },
  { src: "/images/destacadas/04-terraza-atardecer.webp", alt: "Atardecer desde la terraza", category: "featured" },
  { src: "/images/destacadas/05-piscina.webp", alt: "Piscina del condominio", category: "featured" },

  // INTERIORS (Property)
  { src: "/images/el-departamento/01-living-comedor.webp", alt: "Living comedor integrado", category: "property" },
  { src: "/images/el-departamento/02-living-detalle.webp", alt: "Detalle decoracin living", category: "property" },
  { src: "/images/el-departamento/03-comedor-cocina.webp", alt: "Vista hacia la cocina", category: "property" },
  { src: "/images/el-departamento/04-cocina-equipada.webp", alt: "Equipamiento de cocina", category: "property" },
  { src: "/images/el-departamento/05-habitacion-principal.webp", alt: "Dormitorio principal", category: "property" },
  { src: "/images/el-departamento/06-habitacion-principal2.webp", alt: "Dormitorio principal, otro ǭngulo", category: "property" },
  { src: "/images/el-departamento/07-habitacion-principal3.webp", alt: "Cama matrimonial detalle", category: "property" },
  { src: "/images/el-departamento/08-habitacion-principal4.webp", alt: "Escritorio en habitacin principal", category: "property" },
  { src: "/images/el-departamento/09-habitacion-principal5.webp", alt: "Vista habitacin principal", category: "property" },
  { src: "/images/el-departamento/10-bano-suite.webp", alt: "Bao en suite", category: "property" },
  { src: "/images/el-departamento/11-bano-suite2.webp", alt: "Bao en suite, segundo ǭngulo", category: "property" },
  { src: "/images/el-departamento/12-camas-habitacion2.webp", alt: "Segunda habitacin", category: "property" },
  { src: "/images/el-departamento/13-bano2.webp", alt: "Segundo bao", category: "property" },
  { src: "/images/el-departamento/14-bano2-2.webp", alt: "Segundo bao, detalle", category: "property" },
  { src: "/images/el-departamento/15-vista-balcon.webp", alt: "Balcn con vista al mar", category: "property" },
  { src: "/images/el-departamento/16-vista-balcon2.webp", alt: "Vista lateral desde el balcn", category: "property" },
  { src: "/images/el-departamento/18-vista-balcon4.webp", alt: "Amanecer desde el balcn", category: "property" },
  { src: "/images/el-departamento/19-vista-balcon5.webp", alt: "Vista amplia del ocǸano desde terraza", category: "property" },

  // AMENITIES
  { src: "/images/amenidades/01-aerea-condominio.webp", alt: "Vista aǸrea del condominio", category: "amenities" },
  { src: "/images/amenidades/02-terraza-dia.webp", alt: "Terraza comǧn del edificio", category: "amenities" },
  { src: "/images/amenidades/03-piscina-dia.webp", alt: "Piscina en la terraza", category: "amenities" },
  { src: "/images/amenidades/04-quincho.webp", alt: "Quincho y ǭrea de parrilla", category: "amenities" },
  { src: "/images/amenidades/05-terraza-noche.webp", alt: "Terraza del edificio de noche", category: "amenities" },
  { src: "/images/amenidades/06-terraza-atardecer.webp", alt: "Terraza del edificio al atardecer", category: "amenities" },
  { src: "/images/amenidades/07-pasillo-terraza.webp", alt: "Terraza en el dia", category: "amenities" },
  { src: "/images/amenidades/terraza-dia2.webp", alt: "Vista desde terraza compartida", category: "amenities" },
  { src: "/images/amenidades/terraza-noche2.webp", alt: "Atardecer desde terraza comǧn", category: "amenities" },
  { src: "/images/amenidades/palmeras-terraza.webp", alt: "Palmeras en la terraza del edificio", category: "amenities" },
  { src: "/images/amenidades/frontis-condominio.webp", alt: "Fachada principal del edificio", category: "amenities" },
];

async function migrate() {
  console.log('Starting migration...');

  // Group by category to manage priority
  const categories = ['featured', 'property', 'amenities'] as const;

  for (const category of categories) {
    console.log(`Processing category: ${category}`);
    const catImages = imagesToMigrate.filter(img => img.category === category);

    for (let i = 0; i < catImages.length; i++) {
      const item = catImages[i];
      const priority = i + 1;
      const localPath = path.join(process.cwd(), 'public', item.src);
      
      if (!fs.existsSync(localPath)) {
        console.warn(`File not found: ${localPath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(localPath);
      const fileName = path.basename(item.src);
      const storagePath = `${category}/${fileName}`;

      console.log(`Uploading ${fileName} to storage...`);

      // 1. Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.error(`Error uploading ${fileName}:`, uploadError);
        continue;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      // 3. Insert into DB
      console.log(`Inserting ${fileName} into database (priority ${priority})...`);
      const { error: dbError } = await supabase
        .from('images')
        .upsert({
          url: publicUrl,
          storage_path: storagePath,
          category,
          priority,
          metadata: { alt: item.alt }
        }, { onConflict: 'storage_path' });

      if (dbError) {
        console.error(`Error inserting ${fileName} into DB:`, dbError);
      }
    }
  }

  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
