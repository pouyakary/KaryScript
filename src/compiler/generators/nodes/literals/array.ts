
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.ArrayLiteral {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IArrayLiteral,
                                   env: IEnvInfo ): SourceMap.SourceNode {

            const body = Join( ", ",
                node.value.map( i =>
                    env.GenerateSourceNode( i,
                        Nodes.CompileSingleNode( i, env ))))

            return env.GenerateSourceNode( node, Concat([
                '[', body, ']'
            ]))
        }

    // ────────────────────────────────────────────────────────────────────────────────

}