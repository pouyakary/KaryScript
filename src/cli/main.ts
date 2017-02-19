
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../compiler/index.ts" />
/// <reference path="configs/index.ts" />
/// <reference path="builder/index.ts" />

namespace KaryScript.CLI {

    //
    // ─── RUNNING POINT ──────────────────────────────────────────────────────────────
    //

        export function Main ( ) {
            if ( typeof module !== 'undefined' && module.exports )
                SwitchRunner( )
        }

    //
    // ─── SWITCHER ───────────────────────────────────────────────────────────────────
    //

        function SwitchRunner ( ) {
            const args = process.argv.slice(2).join('')

            switch ( args ) {
                case '--help':
                    Commands.PrintHelp( )
                    break

                case '--init':
                case '--version':
                    console.log('not implemented yet')
                    break

                default:
                    Builder.RunBuild( )
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    KaryScript.CLI.Main( )

// ────────────────────────────────────────────────────────────────────────────────

