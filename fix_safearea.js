const fs = require('fs');
const path = require('path');
const files = [
  'app/result.js',
  'app/loading.js',
  'app/styles-picker.js',
  'app/advanced-settings.js',
  'app/(tabs)/credits.js',
  'app/(tabs)/history.js',
  'app/(tabs)/home.js'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const match = content.match(/import\s+\{([^}]*)\}\s+from\s+'react-native';/);
  if (match) {
    let importBody = match[1];
    // Remove SafeAreaView, and any trailing spaces/newlines
    importBody = importBody.replace(/\s*SafeAreaView,?/g, '');
    const newImportBlock = `import {${importBody}} from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';`;
    
    content = content.replace(match[0], newImportBlock);
    fs.writeFileSync(filePath, content);
    console.log('Fixed', f);
  }
});
