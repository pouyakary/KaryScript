
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

namespace KaryScript.Compiler.Nodes.Switch {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISwitchStatement,
                                   env: IEnv ): SourceMap.SourceNode {
            // header
            const parts = [
                "switch (", Nodes.CompileSingleNode( node.switchable, env ), ") {"
            ]

            // cases
            if ( node.cases )
                for ( let caseStatement of node.cases )
                    parts.push( compileCasePart( caseStatement, env ) )


            // default case
            if ( node.defaultBody ) {
                parts.push( "default: " )
                parts.push( Nodes.CompileSingleNode( node.defaultBody, env ) )
            }

            // composing switch:
            return env.GenerateSourceNode( node, parts.concat( '}' ) )
        }

    //
    // ─── COMPILE CASE PART ──────────────────────────────────────────────────────────
    //

        /** compiles each case clause */
        function compileCasePart ( caseStatement: AST.ICaseStatement, env: IEnv ) {
            const cases = caseStatement.cases.map( x =>
                env.GenerateSourceNode( caseStatement, Concat([
                    "case ", Nodes.CompileSingleNode( x, env ), ": "
                ])))

            return ( env.GenerateSourceNode( caseStatement,
                Concat([
                    ( cases as CompiledCode[ ] ),
                    Nodes.CompileSingleNode( caseStatement.body, env),
                    breakIfNotReturning( caseStatement )
                ])
            ))
        }

    //
    // ─── BREAK LOOKAHEAD ────────────────────────────────────────────────────────────
    //

        /** If the branch ended without returning it will automatically breaking. */
        function breakIfNotReturning ( caseStatement: AST.ICaseStatement ) {
            const breakString = " break; "
            if ( caseStatement.body.branch instanceof Array ) {
                const branch = caseStatement.body.branch
                if ( branch[ branch.length - 1 ].type === "ReturnStatement" ) {
                    return ''
                } else {
                    return breakString
                }
            }
            return breakString
        }

    // ────────────────────────────────────────────────────────────────────────────────

}