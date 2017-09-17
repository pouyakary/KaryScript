
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
                          placeholder?: TPlaceholder ): CompiledCode {

            switch ( node.kind ) {
                case 'FunctionCall':
                    return CompileFunctionCallWithArgs(
                        node as AST.IFunctionCall, env, placeholder
                    )

                case 'UnaryOperator':
                    return CompileUnaryOperator(
                        node as AST.IFunctionCall, env, placeholder
                    )

                case 'FunctionCallOnly':
                    return CompileFunctionCallOnly(
                        node as AST.IFunctionCall, env, placeholder
                    )
            }
        }

    //
    // ─── HANDLE PLACEHOLDER ─────────────────────────────────────────────────────────
    //

        type TCompilePlaceholder =
            ( placeholder: TPlaceholder, env: IEnv ) => CompiledCode
        export const CompilePlaceholder: TCompilePlaceholder = ( placeholder, env ) =>
            ( placeholder['$$$isSourceNode$$$']
                ? <SourceMap.SourceNode> placeholder
                : Nodes.CompileSingleNode( placeholder as AST.IBase, env )
                )

    //
    // ─── FUNCTION CALL WITH ARGS ────────────────────────────────────────────────────
    //

        function CompileFunctionCallWithArgs ( node: AST.IFunctionCall,
                                                env: IEnv,
                                       placeholder?: TPlaceholder ): CompiledCode {

            if ( node.command.type === "BinaryOperator" )
                return CompileBinaryOperatorFunction( node, env, placeholder )

            else if ( node.command.type === "UnaryOperator" )
                return CompileUnaryParameterSExpression( node, env, placeholder )

            else
                return CompileSimpleFunctionCallWithArgs( node, env, placeholder )
        }

    //
    // ─── COMPILE BINARY OPERATOR FUNCTION ───────────────────────────────────────────
    //

        function CompileBinaryOperatorFunction ( node: AST.IFunctionCall,
                                                  env: IEnv,
                                         placeholder?: TPlaceholder ): CompiledCode {
            // checks
            if ( !CheckPlaceholderInFunctionCallWithArgsSExpression( node, env ) )
                return ''
            if ( !CheckBinaryOperatorFunction( node, env ) )
                return ''

            // info
            const params
                = GetFunctionArgsByApplyingPlaceholder( node, env, placeholder )

            const operator
                = TranslateOperator(( node.command as AST.IBinaryOperator ).operator )

            const compiledParts =
                Join( ` ${ operator } `, params )

            const chunk =
                [ '(' as CompiledCode ]
                    .concat( compiledParts )
                    .concat([ ')' ])

            // done
            return env.GenerateSourceNode( node, chunk )
        }

    //
    // ─── CHECK BINARY OPERATOR FUNCTION ─────────────────────────────────────────────
    //

        function CheckBinaryOperatorFunction ( node: AST.IFunctionCall,
                                                env: IEnv,
                                       placeholder?: TPlaceholder ) {
            const count =
                ( placeholder? 1 : 0 ) + node.params.length

            if ( count < 2 ) {
                Reporter.Report( env, node,
                        "Binary s-expressions cannot contain less than 2 arguments" )
                return false
            }

            return true
        }

    //
    // ─── COMPILE UNARY SEXPRESSION ──────────────────────────────────────────────────
    //

        function CompileUnaryParameterSExpression ( node: AST.IFunctionCall,
                                                     env: IEnv,
                                            placeholder?: TPlaceholder ) {
            // checks
            if ( !CheckUnaryParameterSExpression( node, env, placeholder ) )
                return ''

            // generating
            return CompileAbstractUnaryOperator(
                node, ( node.command as AST.IUnaryOperator ).operator,
                env, placeholder )
        }

    //
    // ─── CHECK UNARY PARAMETER SEXPRESSION ──────────────────────────────────────────
    //

        function CheckUnaryParameterSExpression ( node: AST.IFunctionCall,
                                                   env: IEnv,
                                          placeholder?: TPlaceholder ) {
            const count =
                ( placeholder? 1 : 0 ) + node.params.length

            if ( count > 1 ) {
                Reporter.Report( env, node, "Unary operators can't take more than one parameter" )
                return false
            }
            return true
        }

    //
    // ─── SIMPLE FUNCTION CALL WITH ARGS ─────────────────────────────────────────────
    //

        function CompileSimpleFunctionCallWithArgs ( node: AST.IFunctionCall,
                                                      env: IEnv,
                                             placeholder?: TPlaceholder ): SourceMap.SourceNode {
            // checks
            if ( !CheckPlaceholderInFunctionCallWithArgsSExpression( node, env ) )
                return env.GenerateSourceNode( node, '' )

            // compiling args
            const args =
                GetFunctionArgsByApplyingPlaceholder( node, env, placeholder )

            // and done.
            return env.GenerateSourceNode( node,
                [ Nodes.CompileSingleNode( node.command, env ), "(", args.join(', '), ")" ])
        }

    //
    // ─── GET FUNCTION ARGS ──────────────────────────────────────────────────────────
    //

        function GetFunctionArgsByApplyingPlaceholder ( node: AST.IFunctionCall,
                                                         env: IEnv,
                                                placeholder?: TPlaceholder ) {

            // data
            let args =
                new Array<SourceMap.SourceNode>( )

            // if place holder sign is present
            if ( node.params.find( x => x.type === 'PipePlaceholder' ) === undefined ) {
                const arguments = ( placeholder?
                    node.params.concat([ <AST.ISExpression> placeholder ]) : node.params )
                for ( let argument of arguments )
                    args.push( <SourceMap.SourceNode> Nodes.CompileSingleNode( argument, env ) )

            // if placeholder sign is not present
            } else {
                for ( let arg of node.params ) {
                    if ( arg.type === 'PipePlaceholder' && placeholder )
                        args.push( <SourceMap.SourceNode> CompilePlaceholder( placeholder, env ) )
                    else
                        args.push( <SourceMap.SourceNode> Nodes.CompileSingleNode( arg, env ) )
                }
            }

            // done
            return args
        }

    //
    // ─── UNARY OPERATOR ─────────────────────────────────────────────────────────────
    //

        type TCompileUnaryOperator =
            ( node: AST.IFunctionCall, env: IEnv, placeholder?: TPlaceholder ) =>
                SourceMap.SourceNode

        export const CompileUnaryOperator: TCompileUnaryOperator = ( node, env, placeholder? ) =>
            CompileAbstractUnaryOperator(
                node, ( <AST.IUnaryOperator> node.command ).operator,
                env,
                placeholder
            )

    //
    // ─── COMPILE ABSTRACT UNARY OPERATOR ────────────────────────────────────────────
    //

        function CompileAbstractUnaryOperator ( node: AST.IFunctionCall,
                                            operator: string,
                                                 env: IEnv,
                                        placeholder?: TPlaceholder ) {

            const ph = <AST.ISExpression>
                ( placeholder? placeholder : node.params[ 0 ] )

            let result: CompiledCode[ ]

            switch ( operator ) {
                case "async":
                case "await":
                case "new":
                case "delete":
                case "typeof":
                case "void":
                    result = [ operator, " ", CompilePlaceholder( ph, env ) ]
                    break

                case "not":
                    result = [ "!", CompilePlaceholder( ph, env ) ]
                    break

                case "clone":
                    result = [ "Object.assign({ }, ", CompilePlaceholder( ph, env ), ")" ]
                    break

                case "inc":
                    result = [ CompilePlaceholder( ph, env ), "++" ]
                    break

                case "dec":
                    result = [ CompilePlaceholder( ph, env ), "--" ]
                    break

                default:
                    result = [ '' ]
            }

            return env.GenerateSourceNode( node,
                    result.concat( Env.Semicolon( env ) ) )
        }

    //
    // ─── SIMPLE FUNCTION CALL ───────────────────────────────────────────────────────
    //

        function CompileFunctionCallOnly ( node: AST.IFunctionCall,
                                            env: IEnv,
                                   placeholder?: TPlaceholder ): CompiledCode {
            // in case of unary operator in pipe expressions
            if ( node.command.type === "UnaryOperator" )
                return CompileUnaryFunctionOnCallOnly( node, env, placeholder )

            // the normal way
            const ph =
                placeholder
                    ? CompilePlaceholder( placeholder, env )
                    : ''

            return env.GenerateSourceNode( node,
                [ Nodes.CompileSingleNode( node.command, env ),  "(", ph, ")"  ])
        }

    //
    // ─── COMPILE UNARY FUNCTION WITH CALL ONLY ──────────────────────────────────────
    //

        function CompileUnaryFunctionOnCallOnly ( node: AST.IFunctionCall,
                                                   env: IEnv,
                                           placeholder?: TPlaceholder ): CompiledCode {
            if ( placeholder ) {
                return CompileAbstractUnaryOperator(
                    node,
                    ( node.command as AST.IUnaryOperator ).operator,
                    env,
                    placeholder
                )
            } else {
                Reporter.Report( env, node, "Unary operators should exactly have one parameter")
                return ''
            }
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
            ( node: AST.IFunctionCall, env: IEnv, ) {
            const count =
                node.params.filter( x => x.type === 'PipePlaceholder' ).length

            return ReportPlaceholderError( count, env, node )
        }

    //
    // ─── REPORT PLACEHOLDER ERROR ───────────────────────────────────────────────────
    //

        function ReportPlaceholderError ( count: number, env: IEnv, node: AST.IBase ) {
            const countLimit =
                GetPlaceholderCountLimit( env )
            const state =
                countLimit >= count

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

        type TGetPlaceholderCountLimit = ( env: IEnv ) => 1 | 0
        export const GetPlaceholderCountLimit: TGetPlaceholderCountLimit = env =>
            ( Env.GetParentType( env ) === 'PipeExpression' )? 1 : 0

    // ────────────────────────────────────────────────────────────────────────────────

}