/**
 * One-off SEO content fixes in Sanity (from the SEO audit).
 *
 *   1. Fills settings.uiText.pageTitles (fixes the empty sr-only <h1> on
 *      home / projects / projectsIndex / about).
 *   2. Localizes the projectInfo "Programa" value that was stored in Spanish
 *      on the Catalan field (and one stray English value).
 *
 * Safe by default: runs a DRY RUN and only prints what would change.
 * Add --apply to actually write.
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

const pageTitles = {
  home: ls(
    "Alventosa Morell Arquitectes — Arquitectura bioclimàtica a Catalunya",
    "Alventosa Morell Arquitectes — Arquitectura bioclimática en Cataluña",
    "Alventosa Morell Architects — Bioclimatic Architecture in Catalonia",
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
    "Sobre Alventosa Morell Arquitectes",
    "Sobre Alventosa Morell Arquitectes",
    "About Alventosa Morell Architects",
  ),
};

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

  // 1. pageTitles
  console.log("• settings.uiText.pageTitles → filling home/projects/projectsIndex/about");
  tx.patch("siteSettings", (p) =>
    p.setIfMissing({ uiText: { _type: "uiText" } }).set({ "uiText.pageTitles": pageTitles }),
  );
  changes++;

  // 2. projectInfo "Programa" localization
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
