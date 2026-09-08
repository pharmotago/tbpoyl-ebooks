const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EBOOK_DIR = path.resolve('C:/Antigravity/Ebook-Landing');

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const out = execSync(cmd, { cwd: EBOOK_DIR, encoding: 'utf8', stdio: 'pipe' });
    if (out.trim()) console.log(out.trim());
    return true;
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return false;
  }
}

console.log('=== 1. SYNCING SRC TO PUBLIC ===');
run('powershell -Command "Copy-Item src/* public/ -Recurse -Force"');

console.log('\n=== 2. CONFIGURING GITHUB REPOSITORY REMOTE ===');
run('git remote set-url origin https://github.com/pharmotago/tbpoyl-ebooks.git');

console.log('\n=== 3. SQUASHING/CLEANING GIT REPO TO PURGE OLD SECRET COMMITS ===');
// Create a clean orphan branch
run('git checkout --orphan clean-main');
// Untrack any accidental secrets
run('git rm --cached .env -f');
run('git rm --cached -r node_modules -f');
// Add all legitimate assets
run('git add .');
run('git commit -m "feat(store): release 10 Sovereign flagship books and Executive Vault with reflowable EPUB 3.0 & print PDFs"');
run('git branch -D main');
run('git branch -m main');

console.log('\n=== 4. PUSHING TO GITHUB ORIGIN MAIN ===');
const ok = run('git push -u origin main --force');
if (ok) {
  console.log('\n🎉 SUCCESS: Ebook-Landing successfully deployed to GitHub (tbpoyl-ebooks)!');
} else {
  console.log('\n⚠️ Push failed, checking status...');
  run('git status');
}
