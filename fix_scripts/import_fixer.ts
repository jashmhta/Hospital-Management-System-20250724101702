import { Project } from 'ts-morph';
import path from 'path';

// Use absolute path to project tsconfig
const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
    skipFileDependencyResolution: false
});

// Fix common import/export patterns
project.getSourceFiles().forEach(file => {
    const filePath = file.getFilePath();
    
    // Skip test files and node_modules
    if (/\/(node_modules|\.test\.|\.spec\.)/.test(filePath)) return;
    
    try {
        // Fix malformed imports
        const imports = file.getImportDeclarations();
        imports.forEach(imp => {
            const text = imp.getText();
            if (text.includes('import') && text.includes('}') && !text.includes('from')) {
                const fixedText = text.replace('import {', 'import { ')
                                     .replace('}', ' } from "@/lib/database"');
                imp.replaceWithText(fixedText);
            }
        });
        
        // Fix malformed exports
        const exports = file.getExportDeclarations();
        exports.forEach(exp => {
            const text = exp.getText();
            if (text.includes('export') && text.includes('}') && !text.includes('from')) {
                const fixedText = text.replace('export {', 'export { ')
                                     .replace('}', ' }');
                exp.replaceWithText(fixedText);
            }
        });
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
});

// Save all changes
project.saveSync();
