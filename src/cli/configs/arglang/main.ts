
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="arg-lang.ts" />
/// <reference path="../../imports.ts" />

namespace KaryScript.CLI.ArgLang {

    //
    // ─── LOAD ───────────────────────────────────────────────────────────────────────
    //

        export function Parse ( ) {
            const argCode = process.argv.slice( 2 ).join(' ')
            const argLangParser = require('./arglang-parser.js')

            try {
                return argLangParser.parse( argCode ) as ArgLang.IRoot

            } catch ( e ) {
                throw PrintParseError( e.location, argCode )
            }
        }
    
    //
    // ─── PRINT ERROR ────────────────────────────────────────────────────────────────
    //

        function PrintParseError ( location, code: string ) {
            const colors = require('colors/safe')

            function repeat ( char: string , times: number ) {
                let result: string[ ] = [ ]
                for ( let i = 0; i < times; i++ )
                    result.push( char )
                return result.join('')
            }

            const paddingString = " " + colors.yellow('│') + " "
            const length = location.end.offset - location.start.offset

            console.log( 'Failed to parse command line args:\n')

            console.log( colors.red( paddingString +
                            repeat( ' ', location.start.offset) +
                            repeat( '↓', length )))
            console.log( paddingString + code )
            console.log( colors.red( paddingString +
                            repeat( ' ', location.start.offset) +
                            repeat( '↑', length )))
            console.log('')
        }

    // ────────────────────────────────────────────────────────────────────────────────

}