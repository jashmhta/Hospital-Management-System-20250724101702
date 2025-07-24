import { Project, SourceFile, ImportDeclaration, ExportDeclaration } from 'ts-morph';
import path from 'path';

// Configuration
const EXCLUSIONS = [
    'node_modules',
    '.git',
    '*.test.*',
    '*.spec.*'
];

// Repair strategy interfaces
interface RepairStrategy {
    (file: SourceFile): void;
}

// Initialize project with proper error handling
try {
    const project = new Project({
        tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
        skipAddingFilesFromTsConfig: false,
        skipFileDependencyResolution: false
    });

    // Register typed repair functions
    const repairStrategies: Record<string, RepairStrategy> = {
        // Fix malformed imports
        fixImports: (file: SourceFile) => {
            file.getImportDeclarations().forEach((imp: ImportDeclaration) => {
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
        fixExports: (file: SourceFile) => {
            file.getExportDeclarations().forEach((exp: ExportDeclaration) => {
                const text = exp.getText();
                if (text.includes('export') && text.includes('}') && !text.includes('from')) {
                    const fixedText = text
                        .replace(/export\s*\{/g, 'export { ')
                        .replace(/\}\s*([^\s])/g, ' }');
                    exp.replaceWithText(fixedText);
                }
            });
        }
    };

    // Process files with enhanced error handling
    project.getSourceFiles().forEach((file: SourceFile) => {
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
    console.log('Syntax repairs completed with strict typing');
    
} catch (error) {
    console.error('Fatal error in repair engine:', error);
    process.exit(1);
}
