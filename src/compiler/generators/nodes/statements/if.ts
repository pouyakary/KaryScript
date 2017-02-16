
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

        export function Compile ( node: AST.IIfStatement,
                                   env: IEnvInfo ): SourceMap.SourceNode {

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

        function CompileSimpleIf ( node: AST.ISimpleIf,
                                    env: IEnvInfo ): SourceMap.SourceNode {
            const predicate = Nodes.CompileSingleNode( node.predicate, env )
            const sign      = ( node.key === 'unless' )? '!' : ''
            const body      = Nodes.CompileSingleNode( node.trueBranch, env )
            return env.GenerateSourceNode( node, 
                [ 'if (', sign, predicate, ') {', body, '}' ])
        }

    //
    // ─── IF WITH ELSE ───────────────────────────────────────────────────────────────
    //

        function CompileIfWithELse ( node: AST.IIfWithElse,
                                      env: IEnvInfo ): SourceMap.SourceNode {
            const mainPart    = CompileSimpleIf( node, env )
            const falseBranch = Nodes.CompileSingleNode( node.falseBranch, env )
            return env.GenerateSourceNode( node,
                [ mainPart, ' else {', falseBranch, '}' ])
        }

    //
    // ─── IF WITH ELSE IF WITH ELSE ──────────────────────────────────────────────────
    //

        function CompileIfWithElseIfWithElse ( node: AST.IIfWithElseIfAndElse,
                                                env: IEnvInfo ): SourceMap.SourceNode {
            // main if (...)
            let parts: CompiledCode[ ] = [ CompileSimpleIf( node, env ) ]

            // also ifs 
            for ( const part of node.elseIfBranches ) {
                parts.push( ' else ' )
                parts.push( CompileSimpleIf( part, env ) )
            }

            // else if
            parts.push(' else {')
            parts.push( Nodes.CompileSingleNode( node.falseBranch, env ) )
            parts.push( '}')

            return env.GenerateSourceNode( node, parts )
        }
    // ────────────────────────────────────────────────────────────────────────────────

}