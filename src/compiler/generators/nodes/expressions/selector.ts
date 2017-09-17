
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="address.ts" />
/// <reference path="../statements/loops/for.ts" />

namespace KaryScript.Compiler.Nodes.Selector {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISelector,
                                   env: IEnv ): SourceMap.SourceNode {

            switch ( node.kind ) {
                case 'query':
                    return CompileQuerySelector( node as AST.IQuerySelector, env )

                case 'range':
                    return CompileRangeSelector( node as AST.IRangeSelector, env )
            }
        }

    //
    // ─── COMPILE QUERY SELECTOR ─────────────────────────────────────────────────────
    //

        function CompileQuerySelector ( node: AST.IQuerySelector,
                                         env: IEnv) {

            let queries: CompiledCode[ ] = [
                Nodes.CompileSingleNode( node.searchable, env )
            ]

            for ( const query of node.queries )
                queries = queries.concat(
                    CompileSingleQuery( query, env ) )

            return env.GenerateSourceNode( node, queries )
        }

    //
    // ─── COMPILE SINGLE QUERY ───────────────────────────────────────────────────────
    //

        function CompileSingleQuery ( node: AST.IBase, env: IEnv ) {

            const query =
                Nodes.CompileSingleNode( node, env )
            let result: CompiledCode[ ]

            if ( node.type === "LambdaExpression" )
                result = [ '.filter(', query, ')' ]
            else
                result = [ "[", query, "]" ]

            return result
        }

    //
    // ─── COMPILE RANGE NODE ─────────────────────────────────────────────────────────
    //

        function CompileRangeSelector ( node: AST.IRangeSelector,
                                         env: IEnv ) {

            if ( node.start.type === 'NumericLiteral' &&
                 node.end.type === 'NumericLiteral' )

                return CompileNumberLiteralRangeSelector( node, env )

            else
                return CompileVarRangeSelector( node, env )

        }

    //
    // ─── COMPILE SIMPLE NODE ────────────────────────────────────────────────────────
    //

        function CompileNumberLiteralRangeSelector ( node: AST.IRangeSelector,
                                                      env: IEnv ) {

            const searchable =
                Nodes.CompileSingleNode( node.searchable, env )
            const start =
                ( node.start as AST.INumericLiteral ).value
            const end =
                ( node.end as AST.INumericLiteral ).value
            const identifier =
                For.GenerateRandomId( )

            return env.GenerateSourceNode( node, [
                searchable, '.slice(', Math.min( start, end ).toString( ), ', ',
                    (Math.max( start, end ) + 1 ).toString( ), ')'
            ])
        }

    //
    // ─── COMPILE VAR BASED RANGE SELECTOR ───────────────────────────────────────────
    //

        function CompileVarRangeSelector ( node: AST.IRangeSelector,
                                            env: IEnv ) {

            const searchable =
                Nodes.CompileSingleNode( node.searchable, env )
            const start =
                Nodes.CompileSingleNode( node.start, env )
            const end =
                Nodes.CompileSingleNode( node.end, env )

            return env.GenerateSourceNode( node, [
                searchable, '.slice(Math.min(', start, ', ', end, '), Math.max(',
                    start, ', ', end, ') + 1)'
            ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}