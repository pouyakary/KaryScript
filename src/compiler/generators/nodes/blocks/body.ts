
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../tools/env.ts" />
/// <reference path="../../../tools/indent.ts" />

namespace KaryScript.Compiler.Nodes.Body {

    //
    // ─── GENERATE FOR BODY ──────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IBody, env: IEnv ): CompiledCode {
            // if the body is empty we should return nothing
            if ( ( node.branch as AST.IEmpty ).type === "Empty" ) return ''

            // making the env info
            let bodyENV: IEnv = Object.assign({ }, env )
            bodyENV.ScopeLevel++

            // if not. we have to compile each statement and add them together
            let compiledStatements = new Array<CompiledCode>( )
            for ( let statement of ( node.branch as AST.TStatements[ ] ) ) {
                switch ( statement.type ) {
                    case 'LineTerminator':
                    case 'Empty':
                    case 'InlineComment':
                    case undefined:
                        break;

                    case 'HolderDeclarationStatement':
                        compiledStatements.push(
                            Nodes.CompileSingleNode( statement, env ) )
                        break;

                    default:
                        compiledStatements.push(
                            Nodes.CompileSingleNode( statement, env ) )
                        compiledStatements.push("; ")
                }
            }

            // updating the env info
            Reporter.ConcatEnvErrors( env, bodyENV )
    
            // done
            return env.GenerateSourceNode( node, compiledStatements )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}