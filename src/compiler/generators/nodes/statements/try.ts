
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Nodes.TryCatch {

    //
    // ─── COMPILE BODY ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ITryCatchStatement, env: IEnv ) {
            // result
            let results = new Array<CompiledCode>( )

            // compiling the main root
            results.push('try { ')
            results.push( Nodes.CompileSingleNode( node.body, env ) )
            results.push('}')

            // if had catch:
            if ( node.exceptionIdentifier && node.catchBody )
                results = results.concat([
                    " catch (",
                    Nodes.CompileSingleNode( node.exceptionIdentifier, env ),
                    ") {",
                    Nodes.Body.Compile( node.catchBody, env ),
                    "}"
                ])

            // if had finally
            if ( node.finallyBody )
                results = results.concat([
                    " finally {",
                    Nodes.CompileSingleNode( node.finallyBody, env ),
                    "}"
                ])

            // done
            return env.GenerateSourceNode( node, results )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}