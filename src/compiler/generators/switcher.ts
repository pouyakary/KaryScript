
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="nodes/blocks/body.ts" />
/// <reference path="nodes/expressions/s-expression.ts" />
/// <reference path="nodes/expressions/lambda.ts" />
/// <reference path="nodes/expressions/pipe.ts" />
/// <reference path="nodes/expressions/shorthand-if.ts" />
/// <reference path="nodes/literals/boolean.ts" />
/// <reference path="nodes/literals/numeric.ts" />
/// <reference path="nodes/literals/string.ts" />
/// <reference path="nodes/literals/array.ts" />
/// <reference path="nodes/literals/object.ts" />
/// <reference path="nodes/statements/declaration/variable.ts" />
/// <reference path="nodes/statements/declaration/function.ts" />
/// <reference path="nodes/statements/declaration/class.ts" />
/// <reference path="nodes/statements/declaration/object.ts" />
/// <reference path="nodes/statements/assignment.ts" />
/// <reference path="nodes/statements/if.ts" />
/// <reference path="nodes/statements/while.ts" />
/// <reference path="nodes/statements/return.ts" />
/// <reference path="nodes/spaces/inline-comment.ts" />
/// <reference path="../sourcemap/mapper.ts" />

namespace KaryScript.Compiler.Nodes {

    //
    // ─── NODE SWITCHER ──────────────────────────────────────────────────────────────
    //

        /** Compiles a simple given node */
        export function CompileSingleNode ( node: AST.IBase | string,
                                             env: IEnvInfo ): string {
            if ( typeof node === 'string' )
                return node

            env.ParentNode.push( node )
            const compiledCode = SwitchAndCompileNode( node, env )
            env.ParentNode.pop( )
            return SourceMap.GenerateMap( node.id, compiledCode )
        }

    //
    // ─── SWITCHER ───────────────────────────────────────────────────────────────────
    //

        function SwitchAndCompileNode ( node: AST.IBase, env: IEnvInfo ): string {
            switch ( node.type ) {
                case 'Body':
                    return Nodes.Body.Compile( node as AST.IBody, env )

                case 'NumericLiteral':
                    return Nodes.Numeric.Compile( node as AST.INumericLiteral )
                
                case 'BooleanLiteral':
                    return Nodes.Boolean.Compile( node as AST.IBooleanLiteral )

                case 'StringLiteral':
                    return Nodes.String.Compile( node as AST.IStringLiteral, env )

                case 'DeclarationStatement':
                    return Nodes.Declaration.Compile(
                        node as AST.DeclarationStatementBase, env
                    )

                case 'FunctionDeclaration':
                    return Nodes.FunctionDeclaration.Compile(
                        node as AST.IFunctionDeclaration, env
                    )

                case 'ClassDeclaration':
                    return Nodes.ClassDeclaration.Compile( node as AST.IClassDeclaration, env )

                case 'ObjectDeclaration':
                    return Nodes.ObjectDeclaration.Compile( node as AST.IObjectDeclaration, env )

                case 'SingleAssignmentStatement':
                    return Nodes.SingleAssignment.Compile(
                        node as AST.ISingleAssignmentStatement, env
                    )

                case 'SExpression':
                    return Nodes.SExpression.Compile( node as AST.ISExpression, env )

                case 'LambdaExpression':
                    return Nodes.Lambda.Compile( node as AST.ILambdaExpression, env )

                case 'ReturnStatement':
                    return Nodes.Return.Compile( node as AST.IReturnStatement, env )

                case 'PipeExpression':
                    return Nodes.Pipe.Compile( node as AST.IPipeExpression, env )

                case 'Identifier':
                case 'AddressIdentifier':
                    return Nodes.Address.Compile( node, env )

                case 'ArrayLiteral':
                    return Nodes.ArrayLiteral.Compile( node as AST.IArrayLiteral, env )

                case 'ObjectLiteral':
                    return Nodes.ObjectLiteral.Compile( node as AST.IObjectLiteral, env )

                case 'IfStatement':
                    return Nodes.If.Compile( node as AST.IIfStatement, env )

                case 'WhileStatement':
                    return Nodes.While.Compile( node as AST.IWhileStatement, env )

                case 'ShorthandIfExpression':
                    return Nodes.ShorthandIf.Compile( node as AST.IShorthandIfExpression, env )

                case 'InlineComment':
                    return Nodes.InlineComment.Compile( node as AST.IInlineComment, env )

                case 'LineTerminator':
                    return '\n'

                case 'Empty':
                default:
                    return ''
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}