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
    const wrap  = require('../../devlibs/wordwrap')

//
// ─── MAIN DEFS ──────────────────────────────────────────────────────────────────
//

    var testCases = [ ]

//
// ─── TEST CASES ─────────────────────────────────────────────────────────────────
//

    testCases.push('def x = 2')

    testCases.push('def x = [ ]')

    testCases.push('def x = [=]')

    testCases.push('while eq a b: end')

    testCases.push()

//
// ─── LOAD PARSER ────────────────────────────────────────────────────────────────
//

    function loadParser ( ) {
        console.log( __dirname )
        const fileContent = fs.readFileSync( path.join( __dirname, '/grammar.pegjs' ), 'utf8')
        return pegjs.generate( fileContent )
    }

//
// ─── TESTER ─────────────────────────────────────────────────────────────────────
//

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
        } catch ( e ) {
            writeLine('─')
            console.log( code )
            writeLine('-')
            console.log( wrapper( e.message ) )
            console.log( )
        }
    }
    for ( let t of testCases ) {
        test( t )
    }

// ────────────────────────────────────────────────────────────────────────────────
