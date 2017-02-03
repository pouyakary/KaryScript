
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.CLI {

    //
    // ─── PARSE COMMANDS ─────────────────────────────────────────────────────────────
    //

        export function ParseAndRunCommands ( ) {
            // init stuff
            let commands = new Array<IArgCommand>( )
            const baseCommandObject: IArgCommand = {
                command: "",
                args: [ ]
            }
            let lastCommand = Object.assign({ }, baseCommandObject)

            // parsing the commands
            if ( process.argv.length > 2 ) {
                for ( let index = 2; index < process.argv.length; index++ ) {
                    console.log( process.argv[ index ] )
                }
            }
        }
    
    //
    // ─── COMMANDS ───────────────────────────────────────────────────────────────────
    //

        export interface IArgCommand {
            command: string
            args: string[ ]
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}