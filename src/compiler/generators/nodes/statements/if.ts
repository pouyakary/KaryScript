
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../interfaces/envinfo.ts" />

namespace KaryScript.Compiler.Nodes.If {

    //
    // ─── COMPILE IF ─────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IIfStatement, env: IEnvInfo ): string {
            switch ( node.kind ) {
                case 'if':
                    return CompileSimpleIf( node as AST.ISimpleIf, env )
                
                case 'if-else':
                    return CompileIfWithELse( node as AST.IIfWithElse, env )

                case 'if-elseif-else':
                    return CompileIfWithElseIfWithElse( node as AST.IIfWithElseIfAndElse, env )
            }
        }

    //
    // ─── COMPILE SIMPLE IF ──────────────────────────────────────────────────────────
    //

        function CompileSimpleIf ( node: AST.ISimpleIf, env: IEnvInfo ) {
            const predicate = Nodes.CompileSingleNode( node.predicate, env )
            const sign      = ( node.key === 'unless' )? '!' : ''
            const body      = Nodes.CompileSingleNode( node.trueBranch, env )
            return 'if (' + sign + predicate + ') {' + body + '\n}'
        }

    //
    // ─── IF WITH ELSE ───────────────────────────────────────────────────────────────
    //

        function CompileIfWithELse ( node: AST.IIfWithElse, env: IEnvInfo ) {
            const mainPart    = CompileSimpleIf( node, env )
            const falseBranch = Nodes.CompileSingleNode( node.falseBranch, env )
            return mainPart + ' else {' + falseBranch + '\n}'
        }

    //
    // ─── IF WITH ELSE IF WITH ELSE ──────────────────────────────────────────────────
    //

        function CompileIfWithElseIfWithElse ( node: AST.IIfWithElseIfAndElse, env ) {
            // main if (...)
            let parts = [ CompileSimpleIf( node, env ) ]

            // also ifs 
            for ( let part of node.elseIfBranches ) {
                parts.push(' else ' + CompileSimpleIf( part, env ) )
            }

            // else if
            parts.push(' else {' + Nodes.CompileSingleNode( node.falseBranch, env )
                        + '\n}')

            return parts.join('')
        }
    // ────────────────────────────────────────────────────────────────────────────────

}