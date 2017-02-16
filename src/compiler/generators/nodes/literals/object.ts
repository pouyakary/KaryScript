
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
                                   env: IEnvInfo ): SourceMap.SourceNode {

            if ( node.value.length === 0 )
                return env.GenerateSourceNode( node, '{}' )

            return env.GenerateSourceNode( node, Concat([
                '{', CompileObjectBody( node, env ), '}' ]))
        }

    //
    // ─── COMPILE OBJECT BODY ────────────────────────────────────────────────────────
    //

        export function CompileObjectBody ( node: AST.IObjectLiteral,
                                             env: IEnvInfo ): SourceMap.SourceNode[ ] {

            return <SourceMap.SourceNode[ ]>
                Join( ", ",
                    node.value.map( pair =>
                        env.GenerateSourceNode( node,
                            CompileObjectPair( pair, env ))))
        }

    //
    // ─── COMPILE OBJECT PAIR ────────────────────────────────────────────────────────
    //

        export function CompileObjectPair ( pair: AST.IObjectMemberPair,
                                             env: IEnvInfo ): CompiledCode[ ] {
            return [
                Nodes.CompileSingleNode( pair.key, env ),
                ": ",
                Nodes.CompileSingleNode( pair.value, env )
            ]
        }

    // ────────────────────────────────────────────────────────────────────────────────

}