
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="address.ts" />
/// <reference path="../../../tools/reporter.ts" />
/// <reference path="../../../tools/env.ts" />

namespace KaryScript.Compiler.Nodes.SExpression {

    //
    // ─── PLACEHOLDER TYPE ───────────────────────────────────────────────────────────
    //

        export type TPlaceholder = TBase | SourceMap.SourceNode

    //
    // ─── S EXPRESSION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISExpression,
                                   env: IEnv, 
                          placeholder?: TPlaceholder ): SourceMap.SourceNode {

            switch ( node.kind ) {
                case 'FunctionCallWithArgs':
                    return CompileFunctionCallWithArgs(
                        node as AST.IFunctionCallWithArgsSExpression, env, placeholder
                    )

                case 'BinaryOperator':
                    return CompileBinaryOperator(
                        node as AST.IBinaryOperatorSExpression, env, placeholder
                    )

                case 'UnaryOperator':
                    return CompileUnaryOperator(
                        node as AST.IUnaryOperatorSExpression, env, placeholder
                    )

                case 'FunctionCallOnly':
                    return CompileFunctionCallOnly(
                        node as AST.IFunctionCallOnlySExpression, env, placeholder
                    )
            }
        }

    //
    // ─── HANDLE PLACEHOLDER ─────────────────────────────────────────────────────────
    //

        function CompilePlaceholder ( placeholder: TPlaceholder,
                                              env: IEnv ): CompiledCode {
            if ( placeholder['$$$isSourceNode$$$'] )
                return <SourceMap.SourceNode> placeholder
            else
                return Nodes.CompileSingleNode( placeholder as AST.IBase, env )
        }

    //
    // ─── FUNCTION CALL WITH ARGS ────────────────────────────────────────────────────
    //

        function CompileFunctionCallWithArgs ( node: AST.IFunctionCallWithArgsSExpression, 
                                                env: IEnv, 
                                       placeholder?: TPlaceholder ): SourceMap.SourceNode {
            // checks
            if ( !CheckPlaceholderInFunctionCallWithArgsSExpression( node, env ) )
                return env.GenerateSourceNode( node, '' )

            // compiling args
            let args = new Array<SourceMap.SourceNode>( )
            if ( node.params.find( x => x.type === 'PipePlaceholder' ) === undefined ) {
                const arguments = ( placeholder?
                    node.params.concat([ <AST.ISExpression> placeholder ]) : node.params )
                for ( let argument of arguments )
                    args.push( <SourceMap.SourceNode> Nodes.CompileSingleNode( argument, env ) )
            } else {
                for ( let arg of node.params ) {
                    if ( arg.type === 'PipePlaceholder' && placeholder )
                        args.push( <SourceMap.SourceNode> CompilePlaceholder( placeholder, env ) )
                    else
                        args.push( <SourceMap.SourceNode> Nodes.CompileSingleNode( arg, env ) )
                }
            }

            // and done.
            return env.GenerateSourceNode( node,
                [ Nodes.CompileSingleNode( node.command, env ), "(", args.join(', '), ")" ])
        }

    //
    // ─── BINARY OPERATOR ────────────────────────────────────────────────────────────
    //

        function CompileBinaryOperator ( node: AST.IBinaryOperatorSExpression, 
                                          env: IEnv,
                                  placeholder?: TPlaceholder ): SourceMap.SourceNode {
            // checks
            if ( !CheckPlaceholderInCompileBinaryOperator( node, env ) )
                return env.GenerateSourceNode( node, '' )

            // supporting funcs
            function handlePlaceholder ( hand: AST.IBase ) {
                if ( hand.type === 'PipePlaceholder' && placeholder )
                    return CompilePlaceholder( placeholder, env )
                else
                    return Nodes.CompileSingleNode( hand, env )
            }

            // body
            const op = <string> TranslateOperator( node.operator )
            return env.GenerateSourceNode( node, [ '(', handlePlaceholder( node.left ),
                 ' ', op, ' ', handlePlaceholder( node.right ), ')' ])
        }

    //
    // ─── UNARY OPERATOR ─────────────────────────────────────────────────────────────
    //

        function CompileUnaryOperator ( node: AST.IUnaryOperatorSExpression, 
                                        env: IEnv,
                                placeholder?: TPlaceholder ): SourceMap.SourceNode {

            const ph = <AST.ISExpression> ( placeholder? placeholder : node.arg )
            let result: CompiledCode[]

            switch ( node.operator ) {
                case "async":
                case "await":
                case "new":
                case "delete":
                case "typeof":
                case "void":
                    result = [ node.operator, " ", CompilePlaceholder( ph, env ) ]
                    break

                case "not":
                    result = [ "!", CompilePlaceholder( ph, env ) ]
                    break
                
                case "clone":
                    result = [ "Object.assign({ }, ", CompilePlaceholder( ph, env ), ")" ]
                    break

                default:
                    result = [ '' ]
            }

            return env.GenerateSourceNode( node, result.concat( Env.Semicolon( env ) ) )
        }

    //
    // ─── SIMPLE FUNCTION CALL ───────────────────────────────────────────────────────
    //

        function CompileFunctionCallOnly ( node: AST.IFunctionCallOnlySExpression,
                                            env: IEnv,
                                   placeholder?: TPlaceholder ): SourceMap.SourceNode {
            const ph = placeholder? CompilePlaceholder( placeholder, env ) : ''
            return env.GenerateSourceNode( node,
                [ Nodes.CompileSingleNode( node.command, env ),  "(", ph, ")"  ])
        }

    //
    // ─── GET OPERATOR ───────────────────────────────────────────────────────────────
    //

        export function TranslateOperator ( op: string ) {
            switch ( op ) {
                case 'sum':
                    return '+'

                case 'mul':
                    return '*'

                case 'sub':
                    return '-'

                case 'div':
                    return '/'

                case 'and':
                    return '&&'

                case 'or':
                    return 'or'

                case 'pow':
                    return '**'

                case 'mod':
                    return '%'

                case 'is':
                case '=':
                    return '==='

                case 'isnt':
                case '!=':
                    return '!==='

                case '>':
                    return '>'

                case '<':
                    return '<'

                case '<=':
                    return '<='

                case '!=':
                    return '!=='
            }
        }

    //
    // ─── CHECK PLACEHOLDER FUNCTION CALL WITH SEXPRESSION ───────────────────────────
    //

        function CheckPlaceholderInFunctionCallWithArgsSExpression
            ( node: AST.IFunctionCallWithArgsSExpression, env: IEnv, ) {
            const count = node.params.filter( x => x.type === 'PipePlaceholder' ).length
            return ReportPlaceholderError( count, env, node )
        }

    //
    // ─── CHECK COMPILE BINARY OPERATOR SEXPRESSION ──────────────────────────────────
    //

        function CheckPlaceholderInCompileBinaryOperator
            ( node: AST.IBinaryOperatorSExpression, env: IEnv ) {
            let count = 0
            if ( node.right.type === 'PipePlaceholder' )
                count++
            if ( node.left.type === 'PipePlaceholder' )
                count++
            return ReportPlaceholderError( count, env, node )
        }

    //
    // ─── REPORT PLACEHOLDER ERROR ───────────────────────────────────────────────────
    //

        function ReportPlaceholderError ( count: number, env: IEnv, node: AST.IBase ) {
            const countLimit = GetPlaceholderCountLimit( env )
            const state = countLimit >= count
            if ( !state ) {
                if ( countLimit === 0 )
                    Reporter.Report( env, node,
                        "S-Expression can contain a Placeholder only if they are" +
                        " used within the root of a Pipe Expression." )
                else
                    Reporter.Report( env, node,
                        "Pipe S-Expressions can only contain one Placeholder." )
            }
            return state
        }

    //
    // ─── GET PLACEHOLDER COUNT LIMIT ────────────────────────────────────────────────
    //

        function GetPlaceholderCountLimit ( env: IEnv ) {
            return ( Env.GetParentType( env ) === 'PipeExpression' )? 1 : 0
        }

    // ────────────────────────────────────────────────────────────────────────────────

}