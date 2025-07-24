import * as fs from 'fs';

function fixRouteFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix import statements
  content = 'import { DB } from "@/lib/database";\n' +
            'import { getSession } from "@/lib/session";\n' +
            'import { NextRequest, NextResponse } from "next/server";\n\n' +
            content;
  
  // Remove duplicate imports
  content = content
    .replace(/import\s+"[^"]+"/g, '')
    .replace(/import\s+[^;]+;/g, '')
    .replace(/\n{3,}/g, '\n\n');
  
  // Fix basic syntax errors
  content = content
    .replace(/\}\s*catch/g, '} catch')
    .replace(/\}\s*\}/g, '}')
    .replace(/\}\s*else/g, '} else');
  
  fs.writeFileSync(filePath, content);
}

fixRouteFile(process.argv[2]);
