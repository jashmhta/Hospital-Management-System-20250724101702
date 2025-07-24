import * as ts from 'typescript';

export function createUnifiedFixer(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Service method fixes
      if (ts.isMethodDeclaration(node) && node.body) {
        if (!node.body.statements.some(s => ts.isTryStatement(s))) {
          const tryBlock = ts.factory.createBlock(node.body.statements, true);
          const catchClause = ts.factory.createCatchClause(
            ts.factory.createVariableDeclaration('error'),
            ts.factory.createBlock([])
          );
          const newBody = ts.factory.createBlock([
            ts.factory.createTryStatement(tryBlock, catchClause, undefined)
          ], true);
          return ts.factory.updateMethodDeclaration(
            node,
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.questionToken,
            node.typeParameters,
            node.parameters,
            node.type,
            newBody
          );
        }
      }

      // Model property fixes
      if ((ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) && !node.type) {
        return ts.factory.updatePropertyDeclaration(
          node,
          node.modifiers,
          node.name,
          node.questionToken,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          node.initializer
        );
      }

      // Syntax fixes
      if (ts.isExpressionStatement(node) && !node.getText().endsWith(';')) {
        return ts.factory.updateExpressionStatement(node, node.expression);
      }

      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(sourceFile, visitor);
  };
}
