
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.Comparison {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IComparison,
                                   env: IEnvInfo ): SourceMap.SourceNode {

            const operator = GetOperator( node )
            return env.GenerateSourceNode( node, Concat([
                "(",
                Nodes.CompileSingleNode( node.left, env ),
                " ", operator, " ",
                Nodes.CompileSingleNode( node.right, env ),
                ")"
            ]))
        }

    //
    // ─── GET KEY ────────────────────────────────────────────────────────────────────
    //

        function GetOperator ( node: AST.IComparison ) {
            switch ( node.key ) {
                case 'and':
                    return '&&'
                case 'or':
                    return '||'
                case '==':
                    return '==='
                case '!=':
                    return '!=='
                default:
                    return node.key
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}