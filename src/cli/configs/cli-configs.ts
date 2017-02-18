
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="arglang/main.ts" />

namespace KaryScript.CLI {

    //
    // ─── PARSE COMMANDS ─────────────────────────────────────────────────────────────
    //

        export function LoadConfigurationsFromCLIArgs ( ) {
            // parsing inputs
            const inputs = ArgLang.Parse( )

            // result object
            let result: ICLIConfig = { }

            // source dir
            if ( inputs.commands['srcDir'] ) {
                const arg = inputs.commands['srcDir'].arg
                if ( arg.type === 'Literal' )
                    result.srcDir = ( arg as ArgLang.ILiteral ).value
            }

            // out dir
            if ( inputs.commands['outDir'] ) {
                const arg = inputs.commands['outDir'].arg
                if ( arg.type === 'Literal' )
                    result.outDir = ( arg as ArgLang.ILiteral ).value
            }

            console.log( inputs )
            return result
        }

    // ────────────────────────────────────────────────────────────────────────────────

}