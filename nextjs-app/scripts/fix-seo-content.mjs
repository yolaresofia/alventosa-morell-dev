/**
 * One-off SEO content fixes in Sanity (from the SEO audit).
 *
 *   1. settings.uiText.pageTitles — fills the empty sr-only <h1> on
 *      home / projects / projectsIndex / about (home targets "Barcelona").
 *   2. home.seo — retargets seoTitle/seoDescription from "Catalunya" to
 *      "Barcelona" (the commercial keyword) in ca/es/en.
 *   3. about.seo.seoTitle — removes the duplicated brand and adds the keyword.
 *   4. Localizes the projectInfo "Programa" value stored in Spanish on the
 *      Catalan field (and one stray English value).
 *
 * Safe by default: runs a DRY RUN and only prints what would change.
 * Add --apply to actually write. Writes to PUBLISHED docs.
 *
 * Usage (from nextjs-app/):
 *   export SANITY_WRITE_TOKEN=sk...           # an Editor/Admin token
 *   node scripts/fix-seo-content.mjs          # dry run (no writes)
 *   node scripts/fix-seo-content.mjs --apply  # write to PUBLISHED docs
 */
import { createClient } from "@sanity/client";

const APPLY = process.argv.includes("--apply");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN env var (needs create/update perms).");
  process.exit(1);
}

const client = createClient({
  projectId: "v677dz4o",
  dataset: "production",
  apiVersion: "2023-05-03",
  token,
  useCdn: false,
});

const ls = (ca, es, en) => ({ _type: "localizedString", ca, es, en });
const loc = (ca, es, en) => ({ ca, es, en }); // seo.seoTitle/seoDescription are stored without _type

const pageTitles = {
  home: ls(
    "Alventosa Morell Arquitectes — Arquitectura bioclimàtica a Barcelona",
    "Alventosa Morell Arquitectes — Arquitectura bioclimática en Barcelona",
    "Alventosa Morell Architects — Bioclimatic Architecture in Barcelona",
  ),
  projects: ls(
    "Projectes — Alventosa Morell Arquitectes",
    "Proyectos — Alventosa Morell Arquitectes",
    "Projects — Alventosa Morell Architects",
  ),
  projectsIndex: ls(
    "Índex de projectes — Alventosa Morell Arquitectes",
    "Índice de proyectos — Alventosa Morell Arquitectes",
    "Project index — Alventosa Morell Architects",
  ),
  about: ls(
    "Sobre nosaltres — Alventosa Morell Arquitectes",
    "Sobre nosotros — Alventosa Morell Arquitectes",
    "About — Alventosa Morell Architects",
  ),
};

const homeSeoTitle = loc(
  "Arquitectura bioclimàtica a Barcelona | Alventosa Morell Arquitectes",
  "Arquitectura bioclimática en Barcelona | Alventosa Morell Arquitectes",
  "Bioclimatic Architecture in Barcelona | Alventosa Morell Architects",
);
const homeSeoDescription = loc(
  "Estudi d'arquitectura a Barcelona especialitzat en habitatges bioclimàtics, rehabilitació sostenible, edificis Passivhaus i projectes de baix consum energètic.",
  "Estudio de arquitectura en Barcelona especializado en viviendas bioclimáticas, rehabilitación sostenible, edificios Passivhaus y proyectos de bajo consumo energético.",
  "Barcelona architecture studio specialising in bioclimatic homes, sustainable renovation, Passivhaus buildings and low-energy projects.",
);
const aboutSeoTitle = loc(
  "Sobre nosaltres — Arquitectura bioclimàtica | Alventosa Morell",
  "Sobre nosotros — Arquitectura bioclimática | Alventosa Morell",
  "About — Bioclimatic Architecture | Alventosa Morell",
);

// Catalan field currently holding Spanish text -> correct Catalan.
const CA_FIX = {
  "Vivienda unifamiliar": "Habitatge unifamiliar",
  "Vivienda plurifamiliar": "Habitatge plurifamiliar",
};
// English field holding a stray Spanish value -> correct English.
const EN_FIX = {
  "Vivienda unifamiliar": "Single-family house",
};

async function run() {
  const tx = client.transaction();
  let changes = 0;

  // 1. pageTitles (sr-only H1s)
  console.log("• settings.uiText.pageTitles → filling home/projects/projectsIndex/about");
  tx.patch("siteSettings", (p) =>
    p.setIfMissing({ uiText: { _type: "uiText" } }).set({ "uiText.pageTitles": pageTitles }),
  );
  changes++;

  // 2. home.seo → retarget to Barcelona
  const home = await client.fetch(`*[_type == "home"][0]{ _id }`);
  if (home?._id) {
    console.log(`• ${home._id} (home).seo → Barcelona seoTitle + seoDescription`);
    tx.patch(home._id, (p) =>
      p
        .setIfMissing({ seo: { _type: "seo" } })
        .set({ "seo.seoTitle": homeSeoTitle, "seo.seoDescription": homeSeoDescription }),
    );
    changes++;
  }

  // 3. about.seo.seoTitle → drop duplicated brand + add keyword
  const about = await client.fetch(`*[_type == "about"][0]{ _id }`);
  if (about?._id) {
    console.log(`• ${about._id} (about).seo.seoTitle → cleaned + keyword`);
    tx.patch(about._id, (p) =>
      p.setIfMissing({ seo: { _type: "seo" } }).set({ "seo.seoTitle": aboutSeoTitle }),
    );
    changes++;
  }

  // 4. projectInfo "Programa" localization
  const projects = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{
      _id, "slug": slug.current,
      "ca": builder[_type=="projectInfo"][0].program.value.ca,
      "en": builder[_type=="projectInfo"][0].program.value.en
    }`,
  );
  for (const proj of projects) {
    const sets = {};
    if (proj.ca && CA_FIX[proj.ca]) sets["builder[_type==\"projectInfo\"].program.value.ca"] = CA_FIX[proj.ca];
    if (proj.en && EN_FIX[proj.en]) sets["builder[_type==\"projectInfo\"].program.value.en"] = EN_FIX[proj.en];
    if (Object.keys(sets).length === 0) continue;
    console.log(`• ${proj.slug}: ${JSON.stringify(sets)}`);
    tx.patch(proj._id, (p) => p.set(sets));
    changes++;
  }

  console.log(`\n${changes} document(s) to patch.`);
  if (!APPLY) {
    console.log("DRY RUN — nothing written. Re-run with --apply to commit.");
    return;
  }
  const res = await tx.commit();
  console.log(`Applied. Transaction ${res.transactionId}.`);
}

run().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
