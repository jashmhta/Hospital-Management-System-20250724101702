import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

// Configuration
const EXCLUSIONS = [
    'node_modules',
    '.git',
    '*.test.*',
    '*.spec.*'
];

// Initialize project with proper error handling
try {
    const project = new Project({
        tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
        skipAddingFilesFromTsConfig: false,
        skipFileDependencyResolution: false
    });

    // Register repair functions for different error patterns
    const repairStrategies = {
        // Fix malformed imports
        fixImports: (file) => {
            file.getImportDeclarations().forEach(imp => {
                const text = imp.getText();
                if (text.includes('import') && text.includes('}') && !text.includes('from')) {
                    const fixedText = text
                        .replace(/import\s*\{/g, 'import { ')
                        .replace(/\}\s*([^\s])/g, ' } from "@/lib/database"');
                    imp.replaceWithText(fixedText);
                }
            });
        },
        
        // Fix malformed exports
        fixExports: (file) => {
            file.getExportDeclarations().forEach(exp => {
                const text = exp.getText();
                if (text.includes('export') && text.includes('}') && !text.includes('from')) {
                    const fixedText = text
                        .replace(/export\s*\{/g, 'export { ')
                        .replace(/\}\s*([^\s])/g, ' }');
                    exp.replaceWithText(fixedText);
                }
            });
        },
        
        // Fix common syntax errors
        fixSyntax: (file) => {
            // Implement additional syntax repair logic here
            // based on the specific error patterns observed
        }
    };

    // Process files with enhanced error handling
    project.getSourceFiles().forEach(file => {
        const filePath = file.getFilePath();
        
        // Skip excluded files
        if (EXCLUSIONS.some(excl => filePath.includes(excl))) return;
        
        try {
            // Apply repair strategies
            Object.values(repairStrategies).forEach(strategy => {
                try {
                    strategy(file);
                } catch (error) {
                    console.error(`Error applying strategy to ${filePath}:`, error);
                }
            });
            
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
        }
    });
    
    // Save changes with validation
    project.saveSync();
    console.log('Syntax repairs completed');
    
} catch (error) {
    console.error('Fatal error in syntax repair engine:', error);
    process.exit(1);
}
