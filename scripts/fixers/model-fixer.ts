import * as ts from 'typescript';

export function createModelFixer(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Fix property declarations in interfaces/classes
      if (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) {
        if (!node.type) {
          return ts.factory.updatePropertyDeclaration(
            node,
            node.modifiers,
            node.name,
            node.questionToken,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            node.initializer
          );
        }
      }

      // Fix missing commas in object literals
      if (ts.isObjectLiteralExpression(node)) {
        const properties = node.properties.map((prop, i, arr) => {
          if (i < arr.length - 1 && !prop.getText().endsWith(',')) {
            return ts.factory.updatePropertyAssignment(
              prop as ts.PropertyAssignment,
              prop.name,
              prop.initializer
            );
          }
          return prop;
        });
        return ts.factory.updateObjectLiteralExpression(node, properties);
      }

      // Fix element access expressions
      if (ts.isElementAccessExpression(node) && !node.argumentExpression) {
        return ts.factory.updateElementAccessExpression(
          node,
          node.expression,
          ts.factory.createStringLiteral('')
        );
      }

      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(sourceFile, visitor);
  };
}
