import { createHash } from 'node:crypto'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const allowMissing = process.argv.includes('--allow-missing')
const outputPath = resolve('docs/public/password-config.json')
const apiUrl = 'https://gitee.com/api/v5/repos/kangyouwei111/my_pwd/contents/pwd.json?ref=master'

async function readLocalToken() {
  try {
    const envFile = await readFile(resolve('.env.local'), 'utf8')
    const line = envFile.match(/^\s*GITEE_TOKEN\s*=\s*(.*?)\s*$/m)
    if (!line?.[1]) return undefined
    return line[1].replace(/^("|')|("|')$/g, '')
  } catch {
    return undefined
  }
}

const token = process.env.GITEE_TOKEN || await readLocalToken()

async function writeConfig(config) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
}

if (!token) {
  if (allowMissing) {
    try {
      await access(outputPath)
    } catch {
      await writeConfig({ algorithm: 'SHA-256', hash: null })
    }
    console.warn('GITEE_TOKEN is not set. Password verification will be unavailable in this local session.')
    process.exit(0)
  }

  throw new Error('GITEE_TOKEN is required to build the protected documentation site.')
}

const response = await fetch(apiUrl, {
  headers: {
    Accept: 'application/json',
    Authorization: `token ${token}`,
    'User-Agent': 'papertrail-docs-build'
  }
})

if (!response.ok) {
  throw new Error(`Gitee password request failed with HTTP ${response.status}. Check GITEE_TOKEN and repository permissions.`)
}

const file = await response.json()
if (typeof file.content !== 'string') {
  throw new Error('Gitee response does not contain pwd.json content.')
}

const decodedContent = Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')
const passwordData = JSON.parse(decodedContent)
if (typeof passwordData.GitHub_page_1 !== 'string') {
  throw new Error('pwd.json must contain a string field named GitHub_page_1.')
}

const hash = createHash('sha256').update(passwordData.GitHub_page_1, 'utf8').digest('hex')
await writeConfig({ algorithm: 'SHA-256', hash })
console.log('Generated password hash from the private Gitee repository.')
