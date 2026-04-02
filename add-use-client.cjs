const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      if (filePath.endsWith('.jsx')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const folder = path.join(__dirname, 'ScribeHealth_form_clone/components/business-model');
const files = walkSync(folder);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('"use client"')) {
    fs.writeFileSync(file, `"use client";\n` + content);
  }
});

console.log(`Prepended 'use client' to ${files.length} files.`);
