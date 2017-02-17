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
/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.SingleAssignment {

    //
    // ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISingleAssignmentStatement,
                                   env: IEnvInfo ): SourceMap.SourceNode {

            const name          = Nodes.CompileSingleNode( node.name, env )
            const assign        = ( node.key === '/=' )? name + "." : ''
            const assignExpr    = Nodes.CompileSingleNode( node.value, env )

            return env.GenerateSourceNode( node, [ name, " = ", assign, assignExpr ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}