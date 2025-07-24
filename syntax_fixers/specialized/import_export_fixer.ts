import { Project } from 'ts-morph';
import path from 'path';

const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../../tsconfig.json')
});

project.getSourceFiles().forEach(file => {
    // Fix malformed imports
    file.getImportDeclarations().forEach(imp => {
        const text = imp.getText();
        if (text.includes('import') && text.includes('}') && !text.includes('from')) {
            const fixedText = text
                .replace(/import\s*\{/g, 'import { ')
                .replace(/\}\s*([^\s])/g, ' } from "@/lib/database"');
            imp.replaceWithText(fixedText);
        }
    });
    
    // Fix malformed exports
    file.getExportDeclarations().forEach(exp => {
        const text = exp.getText();
        if (text.includes('export') && text.includes('}') && !text.includes('from')) {
            const fixedText = text
                .replace(/export\s*\{/g, 'export { ')
                .replace(/\}\s*([^\s])/g, ' }');
            exp.replaceWithText(fixedText);
        }
    });
});

project.saveSync();
