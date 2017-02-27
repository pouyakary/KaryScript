
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
/// <reference path="nodes/expressions/selector.ts" />
/// <reference path="nodes/expressions/comparison.ts" />
/// <reference path="nodes/expressions/exprmember.ts" />
/// <reference path="nodes/literals/boolean.ts" />
/// <reference path="nodes/literals/numeric.ts" />
/// <reference path="nodes/literals/string.ts" />
/// <reference path="nodes/literals/array.ts" />
/// <reference path="nodes/literals/set.ts" />
/// <reference path="nodes/literals/object.ts" />
/// <reference path="nodes/literals/map.ts" />
/// <reference path="nodes/literals/table.ts" />
/// <reference path="nodes/literals/regexp.ts" />
/// <reference path="nodes/literals/reserved-identifiers.ts" />
/// <reference path="nodes/statements/declaration/variable.ts" />
/// <reference path="nodes/statements/declaration/function.ts" />
/// <reference path="nodes/statements/declaration/class.ts" />
/// <reference path="nodes/statements/declaration/object.ts" />
/// <reference path="nodes/statements/declaration/holder.ts" />
/// <reference path="nodes/statements/declaration/use.ts" />
/// <reference path="nodes/statements/declaration/zone.ts" />
/// <reference path="nodes/statements/assignment.ts" />
/// <reference path="nodes/statements/if.ts" />
/// <reference path="nodes/statements/loops/while.ts" />
/// <reference path="nodes/statements/loops/for.ts" />
/// <reference path="nodes/statements/return.ts" />
/// <reference path="nodes/statements/switch.ts" />
/// <reference path="nodes/statements/try.ts" />

namespace KaryScript.Compiler.Nodes {

    //
    // ─── NODE SWITCHER ──────────────────────────────────────────────────────────────
    //

        /** Compiles a simple given node */
        export function CompileSingleNode ( node: AST.IBase | string,
                                             env: IEnv ): CompiledCode {
            if ( typeof node === 'string' )
                return node

            env.ParentNode.push( node )
            const compiledCode = SwitchAndCompileNode( node, env )
            env.ParentNode.pop( )
            return compiledCode
        }

    //
    // ─── SWITCHER ───────────────────────────────────────────────────────────────────
    //

        function SwitchAndCompileNode ( node: AST.IBase,
                                         env: IEnv ): CompiledCode {
            switch ( node.type ) {
                case 'Body':
                    return Nodes.Body.Compile(
                        node as AST.IBody, env )

                case 'NumericLiteral':
                    return Nodes.Numeric.Compile(
                        node as AST.INumericLiteral, env )
                
                case 'BooleanLiteral':
                    return Nodes.Boolean.Compile(
                        node as AST.IBooleanLiteral, env )

                case 'StringLiteral':
                    return Nodes.String.Compile(
                        node as AST.IStringLiteral, env )

                case 'DeclarationStatement':
                    return Nodes.Declaration.Compile(
                        node as AST.DeclarationStatementBase, env )

                case 'FunctionDeclaration':
                    return Nodes.FunctionDeclaration.Compile(
                        node as AST.IFunctionDeclaration, env )

                case 'ClassDeclaration':
                    return Nodes.ClassDeclaration.Compile(
                        node as AST.IClassDeclaration, env )

                case 'ObjectDeclaration':
                    return Nodes.ObjectDeclaration.Compile(
                        node as AST.IObjectDeclaration, env )

                case 'ZoneDeclaration':
                    return Nodes.ZoneDeclaration.Compile(
                        node as AST.IZoneDeclaration, env )

                case 'SingleAssignmentStatement':
                    return Nodes.SingleAssignment.Compile(
                        node as AST.ISingleAssignmentStatement, env )

                case 'SExpression':
                    return Nodes.SExpression.Compile(
                        node as AST.ISExpression, env )

                case 'LambdaExpression':
                    return Nodes.Lambda.Compile(
                        node as AST.ILambdaExpression, env )

                case 'ReturnStatement':
                    return Nodes.Return.Compile(
                        node as AST.IReturnStatement, env )

                case 'PipeExpression':
                    return Nodes.Pipe.Compile(
                        node as AST.IPipeExpression, env )

                case 'Comparison':
                    return Nodes.Comparison.Compile(
                        node as AST.IComparison, env )

                case 'Identifier':
                case 'AddressIdentifier':
                    return Nodes.Address.Compile(
                        node, env )

                case 'ArrayLiteral':
                    return Nodes.ArrayLiteral.Compile(
                        node as AST.IArrayLiteral, env )

                case 'SetLiteral':
                    return Nodes.Set.Compile(
                        node as AST.ISetLiteral, env )

                case 'ObjectLiteral':
                    return Nodes.ObjectLiteral.Compile(
                        node as AST.IObjectLiteral, env )

                case 'MapLiteral':
                    return Nodes.Map.Compile(
                        node as AST.IMapLiteral, env )

                case 'TableLiteral':
                    return Nodes.Table.Compile(
                        node as AST.ITableLiteral, env )

                case 'RegExpLiteral':
                    return Nodes.RegExpLiteral.Compile(
                        node as AST.IRegExpLiteral, env )

                case 'IfStatement':
                    return Nodes.If.Compile(
                        node as AST.IIfStatement, env )

                case 'SwitchStatement':
                    return Nodes.Switch.Compile(
                        node as AST.ISwitchStatement, env )

                case 'WhileStatement':
                    return Nodes.While.Compile(
                        node as AST.IWhileStatement, env )

                case 'ForStatement':
                    return Nodes.For.Compile(
                        node as AST.IForStatement, env )

                case 'ShorthandIfExpression':
                    return Nodes.ShorthandIf.Compile(
                        node as AST.IShorthandIfExpression, env )

                case 'ExpressionMember':
                    return Nodes.ExpressionMember.Compile(
                        node as AST.IExpressionMember, env )

                case 'Selector':
                    return Nodes.Selector.Compile(
                        node as AST.ISelector, env )

                case 'HolderDeclarationStatement':
                    return Nodes.Holder.Declare(
                        node as AST.IHolderDeclarationStatement, env )

                case 'HolderIdentifier':
                    return Nodes.Holder.Use(
                        node as AST.IHolderIdentifier, env )

                case 'UseStatement':
                    return Nodes.Use.Compile(
                        node as AST.IUseStatement, env )

                case 'TryCatchStatement':
                    return Nodes.TryCatch.Compile(
                        node as AST.ITryCatchStatement, env )

                case 'ReservedIdentifiers':
                    return Nodes.ReservedIdentifiers.Compile(
                        node as AST.IReservedIdentifiers )

                case 'LineTerminator':
                case 'Empty':
                case 'InlineComment':
                default:
                    return ''
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}