
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
    // ─── BASE CONFIG ────────────────────────────────────────────────────────────────
    //

        export const BaseConfigObject: ICLIConfig = {
            srcDir:         process.cwd( ),
            files:          [ ],
            ignores:        [ ],
            outDir:         process.cwd( ),
            sourceMap:      false,
        }

    //
    // ─── BASE INTERFACE ─────────────────────────────────────────────────────────────
    //

        export interface ICLIConfig {
            srcDir?:        string
            files?:         string[ ]
            ignores?:       string[ ]
            outDir?:        string
            sourceMap?:     boolean
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}