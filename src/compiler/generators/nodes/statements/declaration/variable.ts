
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.Declaration {

    //
    // ─── DECLARATION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.DeclarationStatementBase,
                                   env: IEnvInfo ): SourceMap.SourceNode {
            if ( node.kind === "SingleAllocInit" )
                return CompileSingleAllocInit( node as AST.SingleAllocInitDeclaration , env )
            else
                return CompileMultiAlloc( node as AST.MultiAllocDeclaration, env )
        }

    //
    // ─── SINGLE ALLOC INIT DECLARATION ─────────────────────────────────────────────
    //

        function CompileSingleAllocInit ( node: AST.SingleAllocInitDeclaration,
                                           env: IEnvInfo ): SourceMap.SourceNode {
            let key: string
            if ( node.modifier === 'con' )
                key = 'const'
            else
                key = GetDeclarationKey( env )

            const name  = Address.CompileIdentifier( node.assignment.name, env )
            const expr  = CompileSingleNode( node.assignment.value, env )

            return env.GenerateSourceNode( node, [
                key, " ", name, " = ", expr, Env.Semicolon( env )
            ])
        }

    //
    // ─── MULTI ALLOC DECLARATION ───────────────────────────────────────────────────
    //

        function CompileMultiAlloc ( node: AST.MultiAllocDeclaration,
                                      env: IEnvInfo ): SourceMap.SourceNode {
            const key   = GetDeclarationKey( env )
            const names = Join( ', ',
                 node.names.map( x => Address.CompileIdentifier( x, env ) ))
            return env.GenerateSourceNode( node,
                Concat([ key, " ", names, Env.Semicolon( env ) ]))
        }

    //
    // ─── GET DECLARATION KEY ───────────────────────────────────────────────────────
    //

        export function GetDeclarationKey ( env: IEnvInfo ) {
            return ( env.ParentNode.length === 3 )? 'var' : 'let'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}