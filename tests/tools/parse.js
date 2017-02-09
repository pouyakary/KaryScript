
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

    const pegjs     = require('pegjs')
    const fs        = require('fs')
    const path      = require('path')
    const errprint  = require('../libs/errprint')
    const util      = require('util')

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    const parser    = loadParser( )
    const code      = loadCodeFile( )

    test( parser, code )

//
// ─── TEST ───────────────────────────────────────────────────────────────────────
//

    function test ( parser, code ) {
        try {
            console.log(
                util.inspect(
                    parser.parse( code ),
                    {
                        showHidden: false,
                        depth: null,
                        colors: true,
                    }
                )
            )
        } catch ( error ) {
            errprint( error, true )
        }
    }

//
// ─── LOAD TEST FILE ─────────────────────────────────────────────────────────────
//

    function loadCodeFile ( ) {
        return fs.readFileSync(
            path.resolve( path.join( __dirname, '../codes/parse.kk' ) ), 'utf8' )
    }

//
// ─── LOAD PARSER ────────────────────────────────────────────────────────────────
//

    function loadParser ( ) {
        const p = path.resolve( path.join( __dirname,
                    '../../src/compiler/grammar/grammar.pegjs' ) )
        const fileContent = fs.readFileSync( p, 'utf8' )
        return pegjs.generate( fileContent )
    }

// ────────────────────────────────────────────────────────────────────────────────
