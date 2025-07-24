import * as fs from 'fs';

function fixRouteFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add missing try-catch blocks
  content = content.replace(/(async function \w+\([^)]*\) \{)([^}]*\} catch \(error\) \{[^}]*\})/g, 
    '$1\n  try {\n$2\n  } catch (error: unknown) {\n    return NextResponse.json(\n      { error: "Internal server error" },\n      { status: 500 }\n    );\n  }');
  
  // Fix response syntax
  content = content.replace(/return \{([^}]*)\}/g, 
    'return NextResponse.json(\n      {$1},\n      { status: 200 }\n    )');
  
  // Fix error response syntax
  content = content.replace(/return \{ error: "([^"]*)" \}/g, 
    'return NextResponse.json(\n      { error: "$1" },\n      { status: 400 }\n    )');
  
  fs.writeFileSync(filePath, content);
}

fixRouteFile(process.argv[2]);
