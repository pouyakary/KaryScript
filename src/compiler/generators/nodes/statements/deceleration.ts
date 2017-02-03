
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.Deceleration {

    //
    // ─── DECELERATION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.DecelerationStatementBase, env: IEnvInfo ) {
            if ( node.kind === "SingleAllocInit" )
                return CompileSingleAllocInit( node as AST.SingleAllocInitDeceleration , env )
            else
                return CompileMultiAlloc( node as AST.MultiAllocDeceleration, env )
        }

    //
    // ─── SINGLE ALLOC INIT DECELERATION ─────────────────────────────────────────────
    //

        function CompileSingleAllocInit ( node: AST.SingleAllocInitDeceleration,
                                           env: IEnvInfo ) {

            const key   = GetDecelerationKey( env )
            const name  = Identifier.Compile( node.assignment.name, env, true )
            const expr  = CompileSingleNode( node.assignment.value, env )

            return `${ key } ${ name } = ${ expr };`
        }

    //
    // ─── MULTI ALLOC DECELERATION ───────────────────────────────────────────────────
    //

        function CompileMultiAlloc ( node: AST.MultiAllocDeceleration, env: IEnvInfo ) {
            const key   = GetDecelerationKey( env )
            const names = node.names.map( x => Identifier.Compile( x, env, true ) )
            return `${ key } ${ names.join(', ') };`
        }

    //
    // ─── GET DECELERATION KEY ───────────────────────────────────────────────────────
    //

        function GetDecelerationKey ( env: IEnvInfo ) {
            return ( env.ScopeLevel === 0 )? 'var' : 'let'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}