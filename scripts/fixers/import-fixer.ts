import * as fs from 'fs';

function fixImports(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix import statements
  content = content
    .replace(/import "@\/lib\/database"/g, 'import { DB } from "@/lib/database"')
    .replace(/import "@\/lib\/session"/g, 'import { getSession } from "@/lib/session"')
    .replace(/import "next\/server"/g, 'import { NextRequest, NextResponse } from "next/server"')
    .replace(/import NextRequest/g, '')
    .replace(/import NextResponse \}/g, '')
    .replace(/import \{ DB \}/g, '')
    .replace(/import \{ getSession \}/g, '')
    .replace(/import \{ type/g, '');

  // Fix multiple empty try-catch blocks
  content = content.replace(/\} catch \(error\) \{[^}]*\}(\s*\} catch \(error\) \{[^}]*\})+/g, '} catch (error) {\n    console.error(error);\n    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }\n    );\n  }');

  fs.writeFileSync(filePath, content);
}

fixImports(process.argv[2]);
