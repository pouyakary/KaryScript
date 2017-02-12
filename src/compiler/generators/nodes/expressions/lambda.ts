
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/reporter.ts" />
/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.Lambda {

    //
    // ─── LAMBDA EXPRESSION ──────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ILambdaExpression, env: IEnvInfo ) {
            if ( node.code.type === 'Body' )
                return ''
            else
                return CompileSimpleLambda( node, env )
        }

    //
    // ─── COMPILE SIMPLE LAMBDA ──────────────────────────────────────────────────────
    //

        function CompileSimpleLambda ( node: AST.ILambdaExpression, env: IEnvInfo ) {
            const args = node.args.map( x => Address.HandleName( x ) ).join(', ')
            return ( ( node.args.length === 1 )? args : "(" + args + ")" ) + " => " +
                    Nodes.CompileSingleNode( node.code, env )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}