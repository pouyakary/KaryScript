
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../imports.ts" />

namespace KaryScript.CLI.Commands {

    //
    // ─── INIT ───────────────────────────────────────────────────────────────────────
    //

        export function Init ( ) {
            try {
                fs.writeFileSync(
                    path.join( process.cwd( ), 'k.yml' ),
                    '---\nsourceMap: true' )
                console.log('→ Config file generated')
            } catch ( e ) {
                console.log( colors.red.bold("→ Couldn't generate the config file") )
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}