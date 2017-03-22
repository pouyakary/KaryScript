
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../commands/tools.ts" />
/// <reference path="../imports.ts" />

namespace KaryScript.CLI.Printer {

    //
    // ─── PRINT ERRORS ───────────────────────────────────────────────────────────────
    //

        export function PrintErrors ( errors: KaryScript.Compiler.Reporter.IErrorBox ) {
            if ( errors.from === 'compiler' )
                PrintNormalErrors( errors )
            else if ( errors.from === 'parser' || errors.from === 'user' )
                PrintLocationBoxErrors( errors )
            else
                console.log( errors )
        }

    //
    // ─── PRINT NORMAL ERRORS ────────────────────────────────────────────────────────
    //

        function PrintNormalErrors ( errors: KaryScript.Compiler.Reporter.IErrorBox ) {
            console.log( errors )
        }

    //
    // ─── PRINT LOCATION BOX ERRORS ──────────────────────────────────────────────────
    //

        function PrintLocationBoxErrors ( errors: KaryScript.Compiler.Reporter.IErrorBox ) {
            for ( const error of errors.errors ) {
                PrintErrorWithLocation( error )
            }
            console.log( fullTermLine( ) )
        }    
    
    //
    // ─── PRINT ERRORS WITH LOCATION ─────────────────────────────────────────────────
    //

        function PrintErrorWithLocation ( error: KaryScript.Compiler.Reporter.ICompilerError ) {
            console.log( fullTermLine( ) )
            console.log(`  → Error @(line: ${ error.location.start.line }, column: ${
                                error.location.start.column }): `)
            console.log(`      ${ chalk.red.bold( error.message ) }`)
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}