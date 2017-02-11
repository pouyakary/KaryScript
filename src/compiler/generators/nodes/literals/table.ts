
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../tools/indent.ts" />

namespace KaryScript.Compiler.Nodes.Table {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ITableLiteral, env: IEnvInfo ) {
            if ( node.header[ 0 ] === "#" ) {
                return ''
            } else {
                return CompileArrayTable( node, env )
            }
        }

    //
    // ─── ARRAY TABLE ────────────────────────────────────────────────────────────────
    //

        function CompileArrayTable ( node: AST.ITableLiteral, env: IEnvInfo ) {
            let rows = new Array<string>( )

            for ( let index = 0; index < node.data.length; index++ )
                rows.push( CompileRow( node.header, node.data[ index ], env ) )

            return "[\n" + 
                rows.join(',\n').split('\n').map( x => "    " + x ).join('\n')
             + "\n]"
        }

    //
    // ─── COMPILE ROW ────────────────────────────────────────────────────────────────
    //

        function CompileRow ( keys: string[ ], cells: AST.IBase[ ], env: IEnvInfo ) {
            let compiledCells = new Array<string>( )

            for ( let index = 0; index < keys.length; index++ )
                compiledCells.push(
                    "    " + Nodes.Address.HandleName( keys[ index ] ) + ": "
                    + Nodes.CompileSingleNode( cells[ index ], env ))

            return "{\n" + compiledCells.join(',\n') + "\n}"
        }

    // ────────────────────────────────────────────────────────────────────────────────

}