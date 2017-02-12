
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../compiler/index.ts" />

namespace KaryScript.CLI {

    //
    // ─── RUNNING POINT ──────────────────────────────────────────────────────────────
    //

        export function RunningPoint ( ) {
            if ( typeof module !== 'undefined' && module.exports )
                Main( )
        }
        
    //
    // ─── MAIN ───────────────────────────────────────────────────────────────────────
    //

        function Main ( ) {
            // ParseAndRunCommands( )
            const fs = require('fs')
            const path = require('path')
            const util = require('util')
            let content = fs.readFileSync(
                path.resolve( path.join( __dirname, '../tests/codes/test.kk' ) ), 'utf8' )

            try {
                console.log( KaryScript.Compiler.Compile( content ) )
            } catch ( e ) {
                console.log( util.inspect( e,
                    {
                        showHidden: false,
                        depth: null,
                        colors: true,
                    }
                ))
            }
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}