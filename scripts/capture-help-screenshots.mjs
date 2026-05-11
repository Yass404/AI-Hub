// Captures the screenshots used by /aide and embeds them into public/help/.
// Run: BASE_URL=http://localhost:5173 node scripts/capture-help-screenshots.mjs
// Or against prod: BASE_URL=https://ai-hub-blush.vercel.app node scripts/capture-help-screenshots.mjs

import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'help')
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const SAMPLE_ARTICLE = `=== 1. CHAMP TITRE (H1) ===
Soirée de Gala : organiser un événement caritatif inoubliable

=== 2. CHAMP CHAPÔ / INTRODUCTION ===
Une soirée de gala marque les esprits par son raffinement et l'engagement qu'elle suscite. Lieu prestigieux, dîner d'exception et programme artistique millimétré : chaque détail compte pour transformer la rencontre en moment fort.

=== 3. CHAMP CONTENU PRINCIPAL (LONG FORM) ===

## Le choix du lieu

Un gala mérite un lieu qui imprime la mémoire — château, hôtel particulier, salle de réception haussmannienne. Privilégie un espace qui se prête à un dîner debout puis assis, avec une scène pour les prises de parole.

## La scénographie de la soirée

L'éclairage est central : bougies sur les tables, lustres en cristal, éclairage chaud sur les murs. Le chemin de table en velours apporte la touche d'élégance. Les compositions florales (roses anciennes, eucalyptus) donnent le ton.

## Le programme artistique

Quatuor à cordes pour le cocktail, pianiste-jazz pour le dîner, DJ pour la fin de soirée. Le rythme doit être pensé pour faire monter l'émotion sans jamais brusquer.

=== 4. MODULE FAQ ===
Q : Quel budget prévoir ? — R : Compter 300-500€/invité pour un gala haut de gamme tout compris.
Q : Combien de personnes minimum ? — R : 80 invités pour amortir un lieu prestigieux.
`

async function shot(page, file, fullPage = false) {
  const out = path.join(OUTPUT_DIR, file)
  await page.screenshot({ path: out, fullPage })
  console.log('  →', file)
}

async function run() {
  console.log(`Capturing screenshots from ${BASE_URL}...`)
  console.log(`Output: ${OUTPUT_DIR}`)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  // 1. Department Rédaction
  await page.goto(`${BASE_URL}/redaction`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await shot(page, '01-departement-redaction.png')

  // 2. Agent Guide — Mission #1 filled
  await page.goto(`${BASE_URL}/redaction/agent/agent-guide`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const subjectInput = page.locator('input[placeholder*="Soirée de Gala"]').first()
  await subjectInput.fill('Soirée de Gala caritative')
  await page.waitForTimeout(400)
  // Scroll to Mission #1 specifically
  await page.locator('text=Définissez votre sujet').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await shot(page, '02-mission-1-rempli.png')

  // 3. (Skipped — Gem response is on Google's side, we put a placeholder)
  // We'll generate a synthetic visual instead by capturing the Gem launch button highlighted.
  // For now, mark this as placeholder by not capturing; the page already shows a placeholder.

  // 4. Mission #2 — filled with article (scroll to it)
  // Scroll all the way to the Mission #2 photo block
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  const articleTextarea = page.locator('textarea[placeholder*="article complet"]').first()
  if (await articleTextarea.count()) {
    await articleTextarea.fill(SAMPLE_ARTICLE)
    await page.waitForTimeout(400)
    await articleTextarea.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await shot(page, '04-mission-2-formulaire.png')

    // 5. Trigger generation and wait for results
    const generateBtn = page.locator('button:has-text("GÉNÉRER LES PROMPTS PHOTO")').first()
    if (await generateBtn.isEnabled().catch(() => false)) {
      await generateBtn.click()
      // Wait for either error or prompts list to appear (max 30s)
      await Promise.race([
        page.waitForSelector('text=/prompt(s)? photo généré/', { timeout: 30000 }).catch(() => null),
        page.waitForSelector('text=Erreur génération', { timeout: 30000 }).catch(() => null),
      ])
      await page.waitForTimeout(800)
      // Scroll to the results
      const promptsLabel = page.locator('text=/prompt(s)? photo généré/').first()
      if (await promptsLabel.count()) {
        await promptsLabel.scrollIntoViewIfNeeded()
        await page.waitForTimeout(400)
      }
      await shot(page, '05-mission-2-prompts-generes.png', true)
    } else {
      console.log('  ! Generate button is disabled, skipping 05')
    }
  } else {
    console.log('  ! Mission #2 textarea not found, skipping 04-05')
  }

  // 3 placeholder — a synthetic capture is too brittle; we'll skip and rely on text in /aide
  // 6 placeholder — Gemini Imagen result is on Google's side; we'll skip

  await browser.close()
  console.log('Done.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
