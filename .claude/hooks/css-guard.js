// PostToolUse hook (Edit|Write): flags CSS-module patterns that caused bugs in this project.
// Only lines added since HEAD are checked, so old code doesn't nag on every edit.
// Exit 2 sends the message back to Claude; otherwise the hook stays silent.
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

let input = ''
process.stdin.on('data', d => (input += d))
process.stdin.on('end', () => {
  let file
  try { file = JSON.parse(input).tool_input.file_path } catch { process.exit(0) }
  if (!file || !/\.module\.css$/.test(file) || !fs.existsSync(file)) process.exit(0)

  let added
  try {
    const diff = execFileSync('git', ['diff', '-U0', 'HEAD', '--', file], { cwd: path.dirname(file), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    added = diff
      ? diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).map(l => l.slice(1))
      : []
    // an untracked file: everything is new
    if (!diff && execFileSync('git', ['ls-files', '--', file], { cwd: path.dirname(file), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === '') added = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  } catch { process.exit(0) }

  const problems = []
  for (const line of added) {
    const px = line.match(/font-size:\s*(\d+(?:\.\d+)?)px/)
    if (px && +px[1] < 12) problems.push(`font-size ${px[1]}px is below the 12px minimum: ${line.trim()}`)
    const rem = line.match(/font-size:\s*(\d*\.?\d+)rem/)
    if (rem && +rem[1] < 0.75) problems.push(`font-size ${rem[1]}rem is below 0.75rem: ${line.trim()}`)
    if (/transition:\s*all\b/.test(line)) problems.push(`"transition: all" lags behind Framer's inline transform/opacity and makes the element jump when an entrance ends; list the properties instead`)
    if (/@media[^{]*max-height/.test(line) && !/min-width:\s*1025px/.test(line)) problems.push(`a laptop "max-height" query also hits tall phones; add "and (min-width: 1025px)": ${line.trim()}`)
    if (/^\s*height:\s*100%/.test(line)) problems.push(`"height: 100%" is 0 when the parent only has min-height (the 3D canvas and modal image broke this way); prefer position:absolute; inset:0 or a grid row`)
  }

  if (problems.length) {
    console.error(`css-guard (${path.basename(file)}), new lines:\n  - ` + [...new Set(problems)].join('\n  - '))
    process.exit(2)
  }
})
