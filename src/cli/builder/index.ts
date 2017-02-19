
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../imports.ts" />

namespace KaryScript.CLI.Builder {

    //
    // ─── BUILD SOLUTION ─────────────────────────────────────────────────────────────
    //

        export function RunBuild ( ) {
            try {
                const configs = GetConfigs( )
                console.log( configs )

                const settings = Settings.GetBuildSettings( configs )
                console.log( settings )

            } catch ( e ) {
                // errors are handles in place
                console.log( e )
            }

            /*
            // ParseAndRunCommands( )
            const fs = require('fs')
            const path = require('path')
            const util = require('util')
            let content = fs.readFileSync( 
                path.join( process.cwd( ), 'bin', 'test.kk' ), 'utf8' )

            try {
                const result = ( <SourceMap.SourceNode>
                    KaryScript.Compiler.Compile( content, "file.kk" ))
                    .toStringWithSourceMap( )
                console.log( result.code )
            } catch ( e ) {
                console.log( util.inspect( e,
                    {
                        showHidden: false,
                        depth: null,
                        colors: true,
                    }
                ))
            }
            */
        }

    // ────────────────────────────────────────────────────────────────────────────────

}