
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../expressions/identifier.ts" />


namespace KaryScript.Compiler.Nodes.Declaration {

    //
    // ─── DECLARATION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.DeclarationStatementBase, env: IEnvInfo ) {
            if ( node.kind === "SingleAllocInit" )
                return CompileSingleAllocInit( node as AST.SingleAllocInitDeclaration , env )
            else
                return CompileMultiAlloc( node as AST.MultiAllocDeclaration, env )
        }

    //
    // ─── SINGLE ALLOC INIT DECLARATION ─────────────────────────────────────────────
    //

        function CompileSingleAllocInit ( node: AST.SingleAllocInitDeclaration,
                                           env: IEnvInfo ) {

            const key   = GetDeclarationKey( env )
            const name  = Identifier.Compile( node.assignment.name, env, node, true )
            const expr  = CompileSingleNode( node.assignment.value, env )

            return `${ key } ${ name } = ${ expr };`
        }

    //
    // ─── MULTI ALLOC DECLARATION ───────────────────────────────────────────────────
    //

        function CompileMultiAlloc ( node: AST.MultiAllocDeclaration, env: IEnvInfo ) {
            const key   = GetDeclarationKey( env )
            const names = node.names.map( x => Identifier.Compile( x, env, node, true ) )
            return `${ key } ${ names.join(', ') };`
        }

    //
    // ─── GET DECLARATION KEY ───────────────────────────────────────────────────────
    //

        function GetDeclarationKey ( env: IEnvInfo ) {
            return ( env.ScopeLevel === 0 )? 'var' : 'let'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}