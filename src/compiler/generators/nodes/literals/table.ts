
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
/// <reference path="../../../tools/reporter.ts" />

namespace KaryScript.Compiler.Nodes.Table {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ITableLiteral, env: IEnvInfo ) {
            if ( !CheckTableSize( node, env ) ) return ''

            if ( node.header[ 0 ] === "#" )
                return CompileObjectTable( node, env )
            else
                return CompileArrayTable( node, env )
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
    // ─── OBJECT TABLES ──────────────────────────────────────────────────────────────
    //

        function CompileObjectTable ( node: AST.ITableLiteral, env: IEnvInfo ) {
            if ( !CheckObjectTable( node, env ) ) return ''

            const objectKeys = node.data.map( x => x[ 0 ] )
            const header = node.header.splice( 1 )
            let rows = new Array<string>( )

            for ( let index = 0; index < node.data.length; index++ )
                rows.push( Nodes.CompileSingleNode( objectKeys[ index ], env ) + ": " +
                     CompileRow( header, node.data[ index ].slice( 1 ), env ) )
            
            return "{\n" + 
                rows.join(',\n').split('\n').map( x => "    " + x ).join('\n')
             + "\n}"
        }

    //
    // ─── COMPILE ROW ────────────────────────────────────────────────────────────────
    //

        function CompileRow ( keys: string[ ], cells: AST.IBase[ ], env: IEnvInfo ) {
            let compiledCells = new Array<string>( )

            for ( let index = 0; index < keys.length; index++ ) {
                const cellValue = (( cells[ index ].type === "EmptyCell" )?
                    "null" : Nodes.CompileSingleNode( cells[ index ], env ))
                compiledCells.push(
                    "    " + Nodes.Address.HandleName( keys[ index ] ) + ": " + cellValue )
            }

            return "{\n" + compiledCells.join(',\n') + "\n}"
        }

    //
    // ─── CHECK TABLE SIZE ───────────────────────────────────────────────────────────
    //

        function CheckTableSize ( node: AST.ITableLiteral, env: IEnvInfo ) {
            const tableSize = node.header.length
            let result = true, line = 1

            for ( let row of node.data ) {
                if ( row.length !== tableSize ) {
                    let word = (( row.length > tableSize )? "more" : "less" )
                    Reporter.Report( env,
                        `Row ${ line } has ${ word } cells than original table size`, node )
                    result = false
                }
                line++
            }

            return result
        }

    //
    // ─── CHECK OBJECT TABLE ─────────────────────────────────────────────────────────
    //

        function CheckObjectTable ( node: AST.ITableLiteral, env: IEnvInfo ) {
            let isOkay = true
            const possibleIdentifiers = [
                "Identifier", "StringLiteral", "AddressIdentifier" ]

            for ( let key of node.data.map( x => x[ 0 ] ) )
                if ( possibleIdentifiers.indexOf( key.type ) === -1 )
                    Reporter.Report( env,
                        `Object of type ${ key.type } can't be used as object table key`,
                        key )

            return isOkay
        }

    // ────────────────────────────────────────────────────────────────────────────────

}