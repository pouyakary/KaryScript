
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.Map {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IMapLiteral,
                                   env: IEnv ): SourceMap.SourceNode {

            if ( node.value.length === 0 )
                return env.GenerateSourceNode( node, 'new Map( )' )

            return env.GenerateSourceNode( node, 
                [ <any> "(new Map( ))" ]
                    .concat( node.value.map( x => CompileMapPair( x, env ))))
        }

    //
    // ─── COMPILE PAIR ───────────────────────────────────────────────────────────────
    //

        function CompileMapPair ( node: AST.IMapMemberPair, env: IEnv ) {
            return env.GenerateSourceNode( node, [
                ".set(", 
                Nodes.CompileSingleNode( node.key, env ),
                ", ",
                Nodes.CompileSingleNode( node.value, env ),
                ")"
            ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}