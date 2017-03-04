
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.CLI.Printer {

    //
    // ─── PRINT ERRORS ───────────────────────────────────────────────────────────────
    //

        export function PrintErrors ( errors: KaryScript.Compiler.Reporter.IErrorBox ) {
            for ( const error of errors.errors ) {
                PrintErrorWithLocation( error )
            }
        }
    
    //
    // ─── PRINT ERRORS WITH LOCATION ─────────────────────────────────────────────────
    //

        function PrintErrorWithLocation ( error: KaryScript.Compiler.Reporter.ICompilerError ) {
            console.log(`→ Error at (line: ${ error.location.start.line }, column: ${ error.location.start.column }): `)
            console.log(`      ${ error.message }`)
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}