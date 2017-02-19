
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.CLI {

    //
    // ─── TOOLS ──────────────────────────────────────────────────────────────────────
    //

        export function repeat ( char: string , times: number ) {
            let result: string[ ] = [ ]
            for ( let i = 0; i < times; i++ )
                result.push( char )
            return result.join('')
        }

    //
    // ─── LINE ───────────────────────────────────────────────────────────────────────
    //

        export function termLine ( ) {
            return '  ' + repeat( '─', (<any>process.stdout).columns - 5 )
        }

    //
    // ─── TITLE ──────────────────────────────────────────────────────────────────────
    //

        export function makeTitleLine ( title: string ) {
            return '\n  ' + title.toUpperCase( ) + '\n' +
                colors.bold( termLine( ) ) + '\n'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}