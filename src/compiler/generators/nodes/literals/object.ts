
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../expressions/address.ts" />
/// <reference path="../../../tools/indent.ts" />
/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.ObjectLiteral {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IObjectLiteral,
                                   env: IEnv ): SourceMap.SourceNode {

            if ( node.value.length === 0 )
                return env.GenerateSourceNode( node, '{}' )

            return env.GenerateSourceNode( node, Concat([
                '{', CompileObjectBody( node, env ), '}' ]))
        }

    //
    // ─── COMPILE OBJECT BODY ────────────────────────────────────────────────────────
    //

        type TCompileObjectBody =
            ( node: AST.IObjectLiteral, env: IEnv ) => SourceMap.SourceNode[ ]
        export const CompileObjectBody: TCompileObjectBody = ( node, env ) =>
            <SourceMap.SourceNode[ ]>
                Join( ", ",
                    node.value.map( pair =>
                        env.GenerateSourceNode( node,
                            CompileObjectPair( pair, env ) ) ) )

    //
    // ─── COMPILE OBJECT PAIR ────────────────────────────────────────────────────────
    //

        type TCompileObjectPair =
            ( pair: AST.IObjectMemberPair, env: IEnv ) => CompiledCode[ ]
        export const CompileObjectPair: TCompileObjectPair = ( pair, env ) =>
            [ Nodes.CompileSingleNode( pair.key, env )
            , ": "
            , Nodes.CompileSingleNode( pair.value, env )
            ]

    // ────────────────────────────────────────────────────────────────────────────────

}