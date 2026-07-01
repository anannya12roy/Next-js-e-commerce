const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src/app/admin'), function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove import styles from '*.module.css'
    content = content.replace(/import\s+styles\s+from\s+['"].*?\.module\.css['"];?\s*/g, '');
    
    // 1. className={styles.foo} -> className="foo"
    content = content.replace(/className=\{styles\.([a-zA-Z0-9_]+)\}/g, 'className="$1"');
    
    // 2. ${styles.foo} -> foo (inside template literals)
    content = content.replace(/\$\{styles\.([a-zA-Z0-9_]+)\}/g, '$1');
    
    // 3. styles.foo -> 'foo' (for ternary operators or other uses)
    content = content.replace(/styles\.([a-zA-Z0-9_]+)/g, "'$1'");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Processed:', filePath);
  }
});
