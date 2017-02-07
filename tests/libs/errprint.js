
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    const wrap = require('./wordwrap')


//
// ─── PRINT SYNTAX ERROR ─────────────────────────────────────────────────────────
//

    module.exports = ( e, upperLine = false ) => {

        //
        // ─── WRITER LINE ─────────────────────────────────────────────────
        //

            function writeLine ( char ) {
                let line = [ ]
                for ( let i = 0; i < 80; i++ ) {
                    line.push( char )
                }
                console.log( line.join('') )
            }

        //
        // ─── WRITER ERROR ────────────────────────────────────────────────
        //

            writeLine( upperLine? '─' : '-' )

            console.log( e.location )
            writeLine('-')
            console.log( `Found:    ${ e.found? `"${ e.found }"` : "NULL" }` )
            console.log(
                "Expected: " + ( wrap( 70 ) ) ( Array.from( new Set(
                            e.expected.map( x => x.text ) ) )
                                        .filter( x => !/\s+/.test( x ) ).join( ' / ' ) )
                                        .split( '\n' ).map( x => `          ${x}`).join( '\n' )
                                        .replace( /^\s+/, '' ) )
            writeLine('─')
            console.log('\n')

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────
