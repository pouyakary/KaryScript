
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/reporter.ts" />


namespace KaryScript.Compiler.Nodes.Identifier {

    //
    // ─── IDENTIFIER ─────────────────────────────────────────────────────────────────
    //

        export function Compile ( name: string, env: IEnvInfo, dec = false ) {
            // changing the shapes and stuff
            const jsName = name.replace( /-/g , '_' )

            // in case we are declaring an identifier which is all ready defined
            if ( dec )
                if ( DoesTheNameExists( name, env ) )
                    Reporter.Report(env, `Identifer "${ name }" is already defined.`,
                                    Reporter.ErrorTypes.Identifier )

            // adding the name
            env.DeclaredIdentifiers.add( jsName )

            // done
            return jsName
        }

    //
    // ─── SEARCH FOR IDENTIFIER ──────────────────────────────────────────────────────
    //

        function DoesTheNameExists ( name: string, env: IEnvInfo ): boolean {
            for ( let identifier of env.DeclaredIdentifiers )
                if ( identifier === name )
                    return true
            return false
        }     

    // ────────────────────────────────────────────────────────────────────────────────

}