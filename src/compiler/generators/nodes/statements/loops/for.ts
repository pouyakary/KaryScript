
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.For {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IForStatement,
                                   env: IEnvInfo ): SourceMap.SourceNode {

            if ( node.kind === 'repeat' )
                return CompileRepeatFor( node as AST.IRepeatForLoop, env )
            else
                return CompileForeachForLoop( node as AST.IForeachForLoop, env )
        }

    //
    // ─── REPEAT FOR ─────────────────────────────────────────────────────────────────
    //

        function CompileRepeatFor ( node: AST.IRepeatForLoop,
                                     env: IEnvInfo ): SourceMap.SourceNode {

            //
            // ─── SUPPORTING DATA ─────────────────────────────────────────────
            //

                const iterator = (( node.indexVar )?
                    Nodes.Address.CompileIdentifier( node.indexVar, env )
                    : GenerateRandomId( ))

                const step = (( node.step )?
                    Nodes.CompileSingleNode( node.step, env ) : '1' )

            //
            // ─── VALUES ──────────────────────────────────────────────────────
            //

                const startingValue = HandleForChangeableExpressions( node, env, true )
                const endingValue   = HandleForChangeableExpressions( node, env, false )

                const defs = Join( ' ', 
                                   <CompiledCode[ ]> [ startingValue, endingValue ]
                                        .filter( x => x.type === 'def' )
                                        .map( x => x.def ))

            //
            // ─── BODY ────────────────────────────────────────────────────────
            //

                const body = Nodes.CompileSingleNode( node.body, env )
            
            //
            // ─── COMPOSING MAIN DATA ─────────────────────────────────────────
            //

                const header = (( node.direction )
                    // up direction 
                    ? env.GenerateSourceNode( node, [
                        "for (let ", iterator,  " = ", startingValue.inLocation,
                        "; ", iterator, " < ", endingValue.inLocation, "; ",
                        iterator, " += ", step, ") {" ])

                    // down direction:
                    : env.GenerateSourceNode( node, [
                        "for (let ", iterator, " = ", endingValue.inLocation, "; ",
                        iterator, " > ", startingValue.inLocation, "; ", iterator,
                        " -= ", step, ") {" ])
                )

            //
            // ─── DONE ────────────────────────────────────────────────────────
            //

                return env.GenerateSourceNode( node,
                    Concat([ defs, header, body, '}' ]))

            // ─────────────────────────────────────────────────────────────────

        }

    //
    // ─── FOREACH LOOP ───────────────────────────────────────────────────────────────
    //

        function CompileForeachForLoop ( node: AST.IForeachForLoop,
                                          env: IEnvInfo ): SourceMap.SourceNode {
            return env.GenerateSourceNode( node,
                [ 'for (let ', Nodes.Address.CompileIdentifier( node.iterator, env ),
                  ' ', node.key, ' ', Nodes.CompileSingleNode( node.iterable, env ),
                  ') {', Nodes.CompileSingleNode( node.body, env ), '}' ])
        }

    //
    // ─── EXTERNAL DEFS ──────────────────────────────────────────────────────────────
    //

        interface IForDefs {
            type:           'def' | 'use'
            inLocation:     CompiledCode
            def?:           SourceMap.SourceNode
        }

        function HandleForChangeableExpressions ( parent: AST.IRepeatForLoop,
                                                     env: IEnvInfo,
                                                   start: boolean ): IForDefs {

            //
            // ─── NODE CODE ───────────────────────────────────────────────────
            //

                const node = start? parent.range.start : parent.range.end
                if ( !node ) return { type: 'use', inLocation: '0' }

            //
            // ─── COMPILED NODE VALUE ─────────────────────────────────────────
            //

                const compiledNode = Nodes.CompileSingleNode( node, env )

            //
            // ─── FINDING THE STATE ───────────────────────────────────────────
            //

                let directUse: boolean

                switch ( node.type ) {
                    // direc use
                    case 'AddressIdentifier':
                    case 'Identifier':
                    case 'NumericLiteral':
                        directUse = true
                        break

                    // evaluation needed
                    case 'SExpression':
                    case 'PipeExpression':
                    case 'ArrayObjectIndexLoader':
                        directUse = false
                        break

                    // on stuff that are not supported in here
                    default:
                        throw Reporter.Report(
                            env,
                            `${ node.type } can't be used as an expression in for loop.`,
                            node
                        )
                }

            //
            // ─── HANDLING DIRECT USE ─────────────────────────────────────────
            //

                if ( directUse )
                    return {
                        type:       'use',
                        inLocation: compiledNode
                    }

            //
            // ─── NOT DIRECTLY USABLE ─────────────────────────────────────────
            //

                else {
                    let identifierName = GenerateRandomId( )
                    return {
                        type:           'def',
                        inLocation:     identifierName,
                        def:            env.GenerateSourceNode( node, [
                                            "const ", identifierName, " = ",
                                            compiledNode, "; "]) 
                    }
                }

            // ─────────────────────────────────────────────────────────────────

        }

    //
    // ─── GENERATE RANDOM NAME ───────────────────────────────────────────────────────
    //

        export function GenerateRandomId ( ) {
            return  "__$KK" +
                    Math.floor( Math.random( ) * Date.now( ) )
                        .toString( )
                        .substring( 2, 6 )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}