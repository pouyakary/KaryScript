
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.Root {
    
    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IRoot, env: IEnv ) {
            const ref = CompileUNIXReference( node )
            const body = Nodes.CompileSingleNode( node.body, env )
            return env.GenerateSourceNode( node, [
                ref, body
            ])
        }

    //
    // ─── UNIX REFERENCE ─────────────────────────────────────────────────────────────
    //

        function CompileUNIXReference ( node: AST.IRoot ) {
            if ( node.ref )
                return node.ref.value + '\n'
            else
                return ''
        }

    // ────────────────────────────────────────────────────────────────────────────────

}