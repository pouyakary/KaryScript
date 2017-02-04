
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="nodes/blocks/body.ts" />
/// <reference path="nodes/blocks/nonbranch.ts" />
/// <reference path="nodes/expressions/identifier.ts" />
/// <reference path="nodes/expressions/s-expression.ts" />
/// <reference path="nodes/literals/boolean.ts" />
/// <reference path="nodes/literals/numeric.ts" />
/// <reference path="nodes/statements/deceleration.ts" />

namespace KaryScript.Compiler.Nodes {

    //
    // ─── NODE SWITCHER ──────────────────────────────────────────────────────────────
    //

        /** Compiles a simple given node */
        export function CompileSingleNode ( node: AST.IBase, env: IEnvInfo ): string {
            env.ParentNode.push( node )
            const compiledCode = SwitchCompiler( node, env )
            env.ParentNode.pop( )
            return compiledCode
        }

    //
    // ─── SWITCHER ───────────────────────────────────────────────────────────────────
    //

        function SwitchCompiler ( node: AST.IBase, env: IEnvInfo ): string {
            switch ( node.type ) {
                case 'Body':
                    return Nodes.Body.Compile( node as AST.IBody, env )

                case 'NumericLiteral':
                    return Nodes.Numeric.Compile( node as AST.INumericLiteral )
                
                case 'BooleanLiteral':
                    return Nodes.Boolean.Compile( node as AST.IBooleanLiteral )

                case 'DecelerationStatement':
                    return Nodes.Deceleration.Compile(
                        node as AST.DecelerationStatementBase, env
                    )

                case 'SExpression':
                    return Nodes.SExpression.Compile( node as AST.ISExpression, env )

                case 'Identifier':
                case 'AddressIdentifier':
                    return Nodes.Address.Compile( node, env )

                case 'Empty':
                default:
                    return ''
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}