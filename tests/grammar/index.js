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

    const pegjs = require('pegjs')
    const fs    = require('fs')
    const path  = require('path')
    const wrap  = require('../libs/wordwrap')

//
// ─── MAIN DEFS ──────────────────────────────────────────────────────────────────
//

    function loadTestCases ( ) {
        const txtLine = '── ────────────────────────────────────────────────────────────────────────────────';
        const file = fs.readFileSync(
            path.resolve( path.join( __dirname, './cases.txt' ) ), 'utf8' )
        return file.split( txtLine ).map( x => x.trim( ) )
    }

    var testCases = loadTestCases( )

//
// ─── LOAD PARSER ────────────────────────────────────────────────────────────────
//

    function loadParser ( ) {
        const p = path.resolve( path.join( __dirname, '../../src/grammar/grammar.pegjs' ) )
        const fileContent = fs.readFileSync( p, 'utf8' )
        return pegjs.generate( fileContent )
    }

//
// ─── TESTER ─────────────────────────────────────────────────────────────────────
//

    module.exports = ( ) => {
        const parser = loadParser( )
        const wrapper = wrap( 80 )

        function writeLine ( char ) {
            let line = [ ]
            for ( let i = 0; i < 80; i++ ) {
                line.push( char )
            }
            console.log( line.join('') )
        }

        function test ( code ) {
            try {
                parser.parse( code )
                return true
            } catch ( e ) {
                writeLine('─')
                console.log( code )
                writeLine('-')
                console.log( e.location )
                writeLine('-')
                console.log( `Found:    ${ e.found }` )
                console.log(
                    "Expected: " + ( wrap( 70 ) ) ( Array.from( new Set(
                                e.expected.map( x => `'${ x.text }'` ) ) )
                                          .filter( x => !/\s+/.test( x ) ).join( ' / ' ) )
                                          .split( '\n' ).map( x => `          ${x}`).join( '\n' )
                                          .replace( /^\s+/, '' ) )
                writeLine('─')
                console.log('\n')
                return false
            }
        }

        let failed = false
        for ( let t of testCases ) {
            if ( !test( t ) ) {
                failed = true
            }
        }

        if ( !failed ) {
            writeLine('─')
            console.log(' A L L   G R A M M A R   T E S T S   C O M P L E T E D   S U C C E S S F U L L Y')
            writeLine('─')
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
