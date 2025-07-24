import * as ts from 'typescript';

export function createApiRouteFixer(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // Fix missing try-catch in route handlers
      if (ts.isFunctionDeclaration(node) && 
          node.body && 
          !node.body.statements.some(s => ts.isTryStatement(s))) {
        const tryBlock = ts.factory.createBlock(node.body.statements, true);
        const catchClause = ts.factory.createCatchClause(
          ts.factory.createVariableDeclaration('error'),
          ts.factory.createBlock([
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('NextResponse.json'),
                undefined,
                [
                  ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier('error'),
                      ts.factory.createIdentifier('error.message')
                    )
                  ], true),
                  ts.factory.createObjectLiteralExpression([
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier('status'),
                      ts.factory.createNumericLiteral('500')
                    )
                  ], true)
                ]
              )
            )
          ], true)
        );
        const newBody = ts.factory.createBlock([
          ts.factory.createTryStatement(tryBlock, catchClause, undefined)
        ], true);
        return ts.factory.updateFunctionDeclaration(
          node,
          node.modifiers,
          node.asteriskToken,
          node.name,
          node.typeParameters,
          node.parameters,
          node.type,
          newBody
        );
      }

      // Fix missing type annotations
      if (ts.isParameter(node) && !node.type) {
        return ts.factory.updateParameterDeclaration(
          node,
          node.modifiers,
          node.dotDotDotToken,
          node.name,
          node.questionToken,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
          node.initializer
        );
      }

      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(sourceFile, visitor);
  };
}
