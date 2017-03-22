
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── MAIN LIBS ──────────────────────────────────────────────────────────────────
//

    const antlr4        = require( 'antlr4/index' )
    const fs            = require( 'fs' )
    const path          = require( 'path' )

//
// ─── PATH TO PARSER FILES ───────────────────────────────────────────────────────
//

    const pathToBin = path.join( __dirname, '../../bin/' )

//
// ─── IMPORTING PARSER ───────────────────────────────────────────────────────────
//

    const KaryScriptLexer    = require( `${ pathToBin }KaryScriptLexer.js` )
    const KaryScriptParser   = require( `${ pathToBin }KaryScriptParser.js` )
    const KaryScriptListener = require( `${ pathToBin }KaryScriptListener.js` )

//
// ─── LOADING INPUT ──────────────────────────────────────────────────────────────
//

    var input   = fs.readFileSync( path.join( __dirname, ''), 'utf8' )

//
// ─── PARSING ────────────────────────────────────────────────────────────────────
//

    console.time('parse time')

    var chars   = new antlr4.InputStream( input )

    var lexer   = new KaryScriptLexer.KaryScriptLexer( chars )
    var tokens  = new antlr4.CommonTokenStream( lexer )
    var parser  = new KaryScriptParser.KaryScriptParser( tokens )

    // this is for the fastest parse time possible (by out 22% faster than the normal case)
    parser._errHandler = new antlr4.error.BailErrorStrategy( )
    parser._interp.predictionMode = 0 // means SSL prediction mode

    parser.buildParseTrees = true;
    var tree = parser.root()

    console.timeEnd('parse time')

// ────────────────────────────────────────────────────────────────────────────────
