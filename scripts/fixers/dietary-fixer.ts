import * as fs from 'fs';

function fixDietaryDashboard(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix missing JSX closing tags
  content = content.replace(/<([A-Z][a-zA-Z]*)([^>]*)>/g, (match, tag, attrs) => {
    if (!match.endsWith('/>') && !content.includes(`</${tag}>`)) {
      return `<${tag}${attrs}></${tag}>`;
    }
    return match;
  });
  
  // Fix invalid JSX tokens
  content = content
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&rbrace;/g, '}')
    .replace(/&lbrace;/g, '{');
    
  // Fix expression expected errors
  content = content.replace(/(\w+)=([^'"\s>]+)(\s|>)/g, '$1="$2"$3');
  
  fs.writeFileSync(filePath, content);
}

fixDietaryDashboard(process.argv[2]);
