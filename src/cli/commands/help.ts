
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
            console.log( )

            console.log('  KaryScript ' +
                KaryScript.Compiler.Version.Name + ' (release #' +
                KaryScript.Compiler.Version.Release + ')')

            console.log()
            console.log('  Command                  Description')
            console.log( colors.bold( termLine( ) ) )
            
            console.log('  --help                   Prints this help page')
            console.log( colors.bold.grey( termLine( ) ) )

            console.log('  --version                Prints version of currently installed KaryScript')
            console.log( colors.bold.grey( termLine( ) ) )

            console.log(`  --init                   Initializes a ${
                colors.underline( 'k.yml' ) } configuration file.`)
            console.log( colors.bold.grey( termLine( ) ) )


            // build way
            console.log()
            console.log('  Build Option             Description')
            console.log( colors.bold( termLine( ) ) )
    
            console.log('  --srcDir "dir"           Sets root directory for codes to "dir"')
            console.log( colors.bold.grey( termLine( ) ) )

            console.log('  --files [files]          Adds the [files] array to included files')
            console.log( colors.bold.grey( termLine( ) ) )

            console.log('  --outDir "dir"           Sets root directory for compilation to "dir"')
            console.log( colors.bold.grey( termLine( ) ) )

            console.log('  --source-map             Enables source map generation')
            console.log( colors.bold.grey( termLine( ) ) )


            console.log( )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}