import { Project } from 'ts-morph';
import path from 'path';

const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../../tsconfig.json')
});

project.getSourceFiles().forEach(file => {
    // Fix common syntax errors
    const text = file.getFullText();
    
    // Fix missing semicolons
    let fixedText = text.replace(/([^;\s])\s*(\/\/|$)/g, '$1; $2');
    
    // Fix malformed type definitions
    fixedText = fixedText.replace(/=\s*</g, '= <');
    
    file.replaceWithText(fixedText);
});

project.saveSync();
