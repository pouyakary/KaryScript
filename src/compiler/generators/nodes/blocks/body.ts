
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.Body {

    //
    // ─── GENERATE FOR BODY ──────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IBody, env: IEnvInfo ): string {
            // if the body is empty we should return nothing
            if ( ( node.branch as AST.IEmpty ).type === "Empty" ) return ''

            // making the env info
            let bodyENV: IEnvInfo = Object.assign({ }, env )
            bodyENV.ScopeLevel++

            // if not. we have to compile each statement and add them together
            let compiledStatements = new Array<string>( )
            for ( let statement of ( node.branch as AST.TStatements[ ] ) )
                compiledStatements.push( Nodes.CompileSingleNode( statement, env ) )

            // updating the env info
            env.Errors = env.Errors.concat( bodyENV.Errors )

            // applying tabulation and we're done
            let result = ( env.ScopeLevel === 0 )
                ? compiledStatements.join( '\n' )
                : compiledStatements.join( '\n' ).split( '\n' )
                                    .map( x => '    ' + x )
                                    .join( '\n' )
            // done
            return result
        }

    // ────────────────────────────────────────────────────────────────────────────────

}