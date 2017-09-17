
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.ExpressionMember {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        type TCompile =
            ( node: AST.IExpressionMember, env: IEnv ) => SourceMap.SourceNode
        export const Compile: TCompile = ( node, env ) =>
            env.GenerateSourceNode( node, [
                Nodes.CompileSingleNode( node.expr, env ),
                ".",
                Nodes.CompileSingleNode( node.member, env )
            ])

    // ────────────────────────────────────────────────────────────────────────────────

}