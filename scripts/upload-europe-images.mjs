// One-time uploader: local Europe package/hotel photos -> Supabase Storage `gtf-images` bucket.
// Mirrors the existing convention already used for the live Africa/Asia packages:
//   packages/<PACKAGE NAME>/<PACKAGE NAME>-N.ext
//   hotels/<PACKAGE NAME>/<city>/[hotel/]<photo>.ext
//
// Usage (run from the repo root):
//   Dry run (default, no upload):
//     node --env-file=.env.local scripts/upload-europe-images.mjs
//   Actually upload:
//     node --env-file=.env.local scripts/upload-europe-images.mjs --upload
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SOURCE_ROOT = 'C:\\GTF Portal Internal\\Website Material\\Website Material\\EUROPE WINTER HOLIDAYS 2026'

// Packages with local image sets. Use --only="<BUCKET NAME>" to upload just one.
const PACKAGES = [
  { localDir: 'EUROPE FOR ALL FAMILY/EUROPE FOR ALL', bucketName: 'EUROPE FOR ALL', hotelsDirName: 'HOTEL LIST' },
  { localDir: 'EUROPE FOR ALL FAMILY/EUROPEAN DHAMAKA', bucketName: 'EUROPEAN DHAMAKA', hotelsDirName: 'HOTEL LIST' },
  { localDir: 'EUROPE FOR ALL FAMILY/EUROPEAN GLIMPSES', bucketName: 'EUROPEAN GLIMPSES', hotelsDirName: 'HOTEL LIST' },
  { localDir: 'GRAND EUROPE FAMILY/GRAND EUROPE', bucketName: 'GRAND EUROPE', hotelsDirName: 'HOTELS' },
  { localDir: 'GRAND EUROPE FAMILY/GEMS OF EUROPE', bucketName: 'GEMS OF EUROPE', hotelsDirName: 'HOTELS' },
  { localDir: 'GRAND EUROPE FAMILY/ESSENCE OF EUROPE', bucketName: 'ESSENCE OF EUROPE', hotelsDirName: 'HOTELS' },
  { localDir: 'PARIS & AMSTERDAM ESCAPE YOUTH SPECIAL', bucketName: 'PARIS & AMSTERDAM ESCAPE', hotelsDirName: 'YOUTH SPECIAL' },
]

const BUCKET = 'gtf-images'
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const CONTENT_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
}

const DO_UPLOAD = process.argv.includes('--upload')
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7)

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
    .map(e => e.name)
    .sort()
}

function walkImages(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkImages(full))
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

function buildManifest() {
  const manifest = []

  for (const pkg of PACKAGES.filter(p => !ONLY || p.bucketName === ONLY)) {
    const pkgRoot = path.join(SOURCE_ROOT, pkg.localDir)
    if (!fs.existsSync(pkgRoot)) {
      console.warn(`Missing local folder for ${pkg.bucketName}: ${pkgRoot}`)
      continue
    }

    // Package hero/gallery photos: image files directly in the package root folder.
    const heroFiles = listImageFiles(pkgRoot)
    heroFiles.forEach((file, i) => {
      const ext = path.extname(file)
      manifest.push({
        localPath: path.join(pkgRoot, file),
        bucketPath: `packages/${pkg.bucketName}/${pkg.bucketName}-${i}${ext}`,
      })
    })

    // Hotel photos: everything under the package's hotel-images subfolder, structure preserved.
    const hotelsRoot = path.join(pkgRoot, pkg.hotelsDirName)
    if (fs.existsSync(hotelsRoot)) {
      for (const filePath of walkImages(hotelsRoot)) {
        let rel = path.relative(hotelsRoot, filePath).split(path.sep)
        // Some packages have a redundant literal "GRAND EUROPE" folder directly under
        // HOTELS (HOTELS\GRAND EUROPE\<city>\...) — drop it so city is the first segment.
        if (rel[0] && rel[0].toUpperCase() === 'GRAND EUROPE') rel = rel.slice(1)
        manifest.push({
          localPath: filePath,
          bucketPath: `hotels/${pkg.bucketName}/${rel.join('/')}`,
        })
      }
    } else {
      console.warn(`No hotel-images folder (${pkg.hotelsDirName}) for ${pkg.bucketName}`)
    }
  }

  return manifest
}

async function main() {
  const manifest = buildManifest()

  console.log(`\nBuilt manifest: ${manifest.length} files across ${PACKAGES.length} packages.\n`)
  for (const item of manifest) console.log(item.bucketPath)

  if (!DO_UPLOAD) {
    console.log(`\nDry run only — no files uploaded. Re-run with --upload to actually upload.`)
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
    console.error('Run with: node --env-file=.env.local scripts/upload-europe-images.mjs --upload')
    process.exit(1)
  }

  const supabase = createClient(url, key)

  let ok = 0, fail = 0
  for (const item of manifest) {
    const ext = path.extname(item.localPath).toLowerCase()
    const buffer = fs.readFileSync(item.localPath)
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(item.bucketPath, buffer, {
        contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
        upsert: true,
      })

    if (error) {
      console.error(`FAILED  ${item.bucketPath} — ${error.message}`)
      fail++
    } else {
      console.log(`OK      ${item.bucketPath}`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${fail} failed.`)
}

main()
