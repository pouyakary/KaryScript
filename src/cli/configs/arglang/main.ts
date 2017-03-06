
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
                const AST = argLangParser.parse( argCode ) as ArgLang.IRoot
                return FormatAST( AST )
            } catch ( e ) {
                throw PrintParseError( e.location, argCode )
            }
        }

    //
    // ─── FORMAT AST ─────────────────────────────────────────────────────────────────
    //

        function FormatAST ( ast: ArgLang.IRoot ): IFormattedAST {
            // checking if it's empty:
            if ( ast.args.length === 0 )
                return { commands: { }, others: [ ] }

            // doing this for non-empty stuff:
            let result: IFormattedAST = {
                commands: { },
                others: new Array<ArgLang.IBase>( )
            }
            for ( const arg of ast.args )
                if ( arg.type === 'Command' )
                    result.commands[ ( arg as ArgLang.ICommand ).name ] =
                        ( arg as ArgLang.ICommand ).arg
                else
                    result.others.push( arg )
        
            // done
            return result
        }

    //
    // ─── FORMATTED AST ──────────────────────────────────────────────────────────────
    //

        export interface IFormattedAST {
            commands:   any
            others:     ArgLang.IBase[ ]
        }

    //
    // ─── PRINT ERROR ────────────────────────────────────────────────────────────────
    //

        // please don't expect this function to be pretty

        function PrintParseError ( location, code: string ) {
            function repeat ( char: string , times: number ) {
                let result: string[ ] = [ ]
                for ( let i = 0; i < times; i++ )
                    result.push( char )
                return result.join('')
            }

            const paddingString = "  │"
            const length = location.end.offset - location.start.offset
            const restLength = code.length - location.end.offset
 
            //console.log( chalk.red( 'Failed to parse command line args:') )
            console.log( )

            console.log( chalk.grey.bold(
                            "  ┌" +
                            repeat( '─', location.start.offset ) + " " +
                            chalk.red.bold( repeat( '↓', length ) ) +
                            " " + repeat( '─', restLength ) +
                            "┐"))

            console.log( chalk.grey.bold("  │ ") +
                            code + chalk.grey.bold(" │"))

            console.log( chalk.grey.bold(
                            "  └" +
                            repeat( '─', location.start.offset) + " " +
                            chalk.red.bold( repeat( '↑', length ) ) +
                            " " + repeat( '─', restLength ) +
                            "┘"
                            ))

            console.log( )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}
