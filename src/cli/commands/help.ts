
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="tools.ts" />

namespace KaryScript.CLI.Commands {

    //
    // ─── HELP ───────────────────────────────────────────────────────────────────────
    //

        export function PrintHelp ( ) {
            console.log()
            console.log('  KaryScript')
            console.log('  ' + repeat('-', process.env.COLUMNS - 4 ) )
            console.log()
        }

    // ────────────────────────────────────────────────────────────────────────────────

}