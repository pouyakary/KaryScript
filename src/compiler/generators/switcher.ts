
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Nodes {

    //
    // ─── NODE SWITCHER ──────────────────────────────────────────────────────────────
    //

        /** Compiles a simple given node */
        export function CompileSingleNode ( node: AST.IBase, env: IEnvInfo ): string {
            switch ( node.type ) {
                case 'Body':
                    return Nodes.Blocks.Body.Compile( node as AST.IBody, env )

                case 'NumericLiteral':
                    return Nodes.Literals.Numeric.Compile( node as AST.INumericLiteral )
                
                case 'BooleanLiteral':
                    return Nodes.Literals.Boolean.Compile( node as AST.IBooleanLiteral )

                case 'DecelerationStatement':
                    return Nodes.Statements.Deceleration.Compile(
                        node as AST.DecelerationStatementBase, env)

                case 'Empty':
                default:
                    return ''
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}