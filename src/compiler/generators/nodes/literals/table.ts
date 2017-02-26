
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
/// <reference path="../../../tools/concat.ts" />
/// <reference path="../../../tools/reporter.ts" />

namespace KaryScript.Compiler.Nodes.Table {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ITableLiteral,
                                   env: IEnv ): SourceMap.SourceNode {
            // checks
            if ( !CheckTableSize( node, env ) )
                return env.GenerateSourceNode( node, '' )
            if ( !CheckHeaderPlaceholder( node, env ) )
                return env.GenerateSourceNode( node, '' )

            // body
            if ( node.header[ 0 ].type === 'Octothorpe' )
                return CompileObjectTable( node, env )
            else
                return CompileArrayTable( node, env )
        }

    //
    // ─── ARRAY TABLE ────────────────────────────────────────────────────────────────
    //

        function CompileArrayTable ( node: AST.ITableLiteral,
                                      env: IEnv ): SourceMap.SourceNode {

            let rows = new Array<CompiledCode>( )

            for ( let index = 0; index < node.data.length; index++ )
                rows.push( CompileRow( node.header, node.data[ index ], env, false ) )

            return env.GenerateSourceNode( node, Concat([
                "[",  Join('\, ', rows ), "]"
            ]))
        }

    //
    // ─── OBJECT TABLES ──────────────────────────────────────────────────────────────
    //

        function CompileObjectTable ( node: AST.ITableLiteral,
                                       env: IEnv ): SourceMap.SourceNode {
            // checks
            if ( !CheckObjectTable( node, env ) )
                return env.GenerateSourceNode( node, '' )

            // body
            const   objectKeys  = node.data.map( x => x.cells[ 0 ] )
            const   header      = node.header.splice( 1 )
            let     rows        = new Array<SourceMap.SourceNode>( )

            for ( let index = 0; index < node.data.length; index++ )
                rows.push( env.GenerateSourceNode( node, [
                    Nodes.CompileSingleNode( objectKeys[ index ], env ),
                    ": ",
                     CompileRow( header, node.data[ index ], env, true )
                ]))
            
            return env.GenerateSourceNode( node, Concat([ "{", Join(', ', rows),  "}" ]))
        }

    //
    // ─── COMPILE ROW ────────────────────────────────────────────────────────────────
    //

        function CompileRow ( keys: AST.THeaderable[ ],
                               row: AST.ITableRow,
                               env: IEnv,
                             slice: boolean ): SourceMap.SourceNode {
            // defs
            const   cells           = ( slice? row.cells.slice( 1 ) : row.cells )
            let     compiledCells   = new Array<SourceMap.SourceNode>( )

            // body
            for ( let index = 0; index < keys.length; index++ ) {
                const cellValue = (( cells[ index ].type === "EmptyCell" )?
                    "null" : Nodes.CompileSingleNode( cells[ index ], env ))

                compiledCells.push(
                    env.GenerateSourceNode( keys[ index ] , [
                        Nodes.CompileSingleNode( keys[ index ], env ),
                        ": ",
                        cellValue
                    ]))
            }

            // done
            return env.GenerateSourceNode( row, Concat([
                "{", Join( ", ", compiledCells ), "}"
            ]))
        }

    //
    // ─── CHECK TABLE SIZE ───────────────────────────────────────────────────────────
    //

        function CheckTableSize ( node: AST.ITableLiteral, env: IEnv ) {
            const tableSize = node.header.length
            let result = true, line = 1

            for ( let row of node.data ) {
                if ( row.cells.length !== tableSize ) {
                    let word = (( row.cells.length > tableSize )? "more" : "less" )

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

        function CheckObjectTable ( node: AST.ITableLiteral, env: IEnv ) {
            let isOkay = true
            const possibleIdentifiers = [
                "Identifier", "StringLiteral", "AddressIdentifier"
            ]

            for ( const key of node.data.map( x => x.cells[ 0 ] ) )
                if ( possibleIdentifiers.indexOf( key.type ) === -1 )
                    Reporter.Report( env,
                        `Object of type ${ key.type } can't be used as object table key`,
                        key )

            return isOkay
        }

    //
    // ─── HEADER PLACE HOLDER CHECKER ────────────────────────────────────────────────
    //

        function CheckHeaderPlaceholder ( node: AST.ITableLiteral, env: IEnv ) {
            let locationSum = 0

            for ( let index = 0; index < node.header.length; index++ )
                if ( node.header[ index ].type === 'Octothorpe' )
                    locationSum += index

            if ( locationSum > 1 )
                Reporter.Report( env,
                    "'#' Can only be used at the first cell of table's header", node)

            return ( locationSum > 1 )? false : true
        }

    // ────────────────────────────────────────────────────────────────────────────────

}