
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Nodes.Range {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        type TCompile =
            ( node: AST.IRangeLiteral, env: IEnv ) => string | SourceMap.SourceNode
        export const Compile: TCompile = ( node, env ) =>
            node.start.type === 'NumericLiteral' && node.end.type === 'NumericLiteral'
                ? CompileWithExactStartEnd( node, env )
                : CompileUnkownRange( node, env )

    //
    // ─── IN CASE WE KNOW EXACTLY WHAT START AND END ARE ─────────────────────────────
    //

        function CompileWithExactStartEnd ( node: AST.IRangeLiteral, env: IEnv ) {
            // info
            const start = ( node.start as AST.INumericLiteral ).value
            const end   = ( node.end as AST.INumericLiteral ).value

            // switcher
            let result
            if ( Math.abs( end - start ) < 22 )
                result = CompileRangeWithLessThan22Elements( start, end, node.connector )
            else
                result = CompileExactRangeWithMoreThan22Elements( node, env )

            // done, ready to send
            return env.GenerateSourceNode( node, result )
        }

    //
    // ─── IN CASE OF NUMBERS LESS THAN 22 ────────────────────────────────────────────
    //

        function CompileRangeWithLessThan22Elements ( start: number,
                                                        end: number,
                                                  connector: string ) {
            let range = new Array<number> ( )
            if ( start < end )
                if ( connector === '..' )
                    for ( let counter = start; counter < end; counter++ )
                        range.push( counter )
                else
                    for ( let counter = start; counter <= end; counter++ )
                        range.push( counter )
            else
                if ( connector === '..' )
                    for ( let counter = start; counter > end; counter-- )
                        range.push( counter )
                else
                    for ( let counter = start; counter >= end; counter-- )
                        range.push( counter )

            return '[' + range.join(', ') + ']'
        }

    //
    // ─── COMPILE EXACT RANGE MORE THAN 22 ELEMENTS ──────────────────────────────────
    //

        function CompileExactRangeWithMoreThan22Elements ( node: AST.IRangeLiteral,
                                                            env: IEnv ) {
            // identifiers
            const resultsArrayIdentifier = Nodes.For.GenerateRandomId( )
            const counterIdentifier      = Nodes.For.GenerateRandomId( )

            // info
            const start =
                ( node.start as AST.INumericLiteral ).value
            const end =
                ( node.end as AST.INumericLiteral ).value
            const incOperator =
                ( start > end ? '--' : '++' )
            const check =
                ( start > end )? ' >'  : ' <'
            const checkTail =
                ( node.connector === '...'? '= ' : ' ' )

            // result container
            let results = [
                '(function (){let ', resultsArrayIdentifier, ' = []; for(let ',
                counterIdentifier, ' = ', start.toString( ), '; ',
                counterIdentifier, check, checkTail, end.toString( ), '; ',
                counterIdentifier, incOperator, '){ ', resultsArrayIdentifier,
                '.push(', counterIdentifier, ') } return ', resultsArrayIdentifier,
                '; }).apply(this)'
            ]

            // done
            return results.join('')
        }

    //
    // ─── COMPILE UNKOWN RANGE ───────────────────────────────────────────────────────
    //

        function CompileUnkownRange ( node: AST.IRangeLiteral, env: IEnv ) {
            // info
            const resultsArrayIdentifier =
                Nodes.For.GenerateRandomId( )
            const counterIdentifier =
                Nodes.For.GenerateRandomId( )
            const start =
                GenerateUnknownReference( node.start, env )
            const end =
                GenerateUnknownReference( node.end, env )
            const startAssignment =
                ( start.assignment
                    ? start.assignment
                    : start.reference
                    )

            const assignment =
                AssembleAssignments([
                    startAssignment,
                    end.assignment
                ])

            const checkTail =
                ( node.connector === '...'
                    ? '= '
                    : ' '
                    )

            // result array
            let result = [
                '(function (){let ', resultsArrayIdentifier, ' = []; for(let ',
                counterIdentifier, ' = ', assignment, '; ', start.reference,
                ' <= ', end.reference, '? ', counterIdentifier, ' <', checkTail,
                end.reference, ' : ', counterIdentifier, ' >', checkTail,
                end.reference, '; ', start.reference, ' <= ', end.reference, '? ',
                counterIdentifier, '++ : ', counterIdentifier, '-- ){ ',
                resultsArrayIdentifier, '.push(', counterIdentifier, ')} return ',
                resultsArrayIdentifier, '; }).apply(this)'
            ]

            // done
            return result.join('')
        }

    //
    // ─── GENERATE UNKOWN REFERENCE ──────────────────────────────────────────────────
    //

        interface IUnknownReferenceResult {
            assignment: string | null
            reference:  string
        }

        function GenerateUnknownReference ( node: AST.IBase,
                                             env: IEnv ): IUnknownReferenceResult {

            if ( node.type === 'PipeExpression' || node.type === 'SExpression' ) {
                const supportRef =
                    Nodes.For.GenerateRandomId( )
                return {
                    assignment: `${ supportRef } = ${
                        Nodes.CompileSingleNode( node, env ).toString( ) }`,
                    reference: supportRef
                }

            } else {
                const ref =
                    Nodes.CompileSingleNode( node, env ).toString( )
                return {
                    assignment: null,
                    reference: ref
                }
            }
        }

    //
    // ─── JOIN ASSIGNMENT ────────────────────────────────────────────────────────────
    //

        type TAssembleAssignments = ( parts: ( string | null )[ ] ) => string
        const AssembleAssignments: TAssembleAssignments = parts =>
            ( parts[ 1 ] !== null
                ? parts.join(', ')
                : <string> parts[ 0 ]
                )

    // ────────────────────────────────────────────────────────────────────────────────

}