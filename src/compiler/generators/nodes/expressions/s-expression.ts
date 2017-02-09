
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
    // ─── S EXPRESSION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISExpression , env: IEnvInfo, 
                                  placeholder?: TBase ): string {

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
    // ─── FUNCTION CALL WITH ARGS ────────────────────────────────────────────────────
    //

        function CompileFunctionCallWithArgs ( node: AST.IFunctionCallWithArgsSExpression, 
                                                env: IEnvInfo, 
                                       placeholder?: TBase ) {
            // compiling args
            let args = new Array<string>( )
            if ( node.params.find( x => x.type === 'PipePlaceholder' ) === undefined ) {
                const arguments = placeholder?
                    node.params.concat([ <AST.ISExpression> placeholder ]) : node.params
                for ( let argument of arguments )
                    args.push( Nodes.CompileSingleNode( argument, env ) )
            } else {
                for ( let arg of node.params ) {
                    if ( arg.type === 'PipePlaceholder' && placeholder )
                        args.push( Nodes.CompileSingleNode( placeholder, env ) )
                    else
                        args.push( Nodes.CompileSingleNode( arg, env ) )
                }
            }
            // and done.
            return Nodes.CompileSingleNode( node.command, env ) + "(" + 
                    args.join(', ') + ")" + Env.Semicolon( env )
        }

    //
    // ─── BINARY OPERATOR ────────────────────────────────────────────────────────────
    //

        function CompileBinaryOperator ( node: AST.IBinaryOperatorSExpression, 
                                          env: IEnvInfo,
                                  placeholder?: TBase ) {
            const op = TranslateOperator( node.operator )
            function handlePlaceholder ( hand: AST.IBase ) {
                if ( hand.type === 'PipePlaceholder' && placeholder )
                    return Nodes.CompileSingleNode( placeholder, env )
                else
                    return Nodes.CompileSingleNode( hand, env )
            }
            return '(' + handlePlaceholder( node.left ) + ' ' + op + ' ' +
                    handlePlaceholder( node.right ) + ')'
        }

    //
    // ─── UNARY OPERATOR ─────────────────────────────────────────────────────────────
    //

        function CompileUnaryOperator ( node: AST.IUnaryOperatorSExpression, 
                                         env: IEnvInfo,
                                placeholder?: TBase ) {
            const ph = <AST.ISExpression> ( placeholder? placeholder : node.arg )
            const op = ( node.operator === 'not' )? '!' : node.operator
            return op + " " + Nodes.CompileSingleNode( ph, env ) + Env.Semicolon( env )
        }

    //
    // ─── SIMPLE FUNCTION CALL ───────────────────────────────────────────────────────
    //

        function CompileFunctionCallOnly ( node: AST.IFunctionCallOnlySExpression,
                                            env: IEnvInfo,
                                   placeholder?: TBase ) {
            const ph = placeholder? Nodes.CompileSingleNode( placeholder, env ) : ''
            return Address.Compile( node.command, env ) + "(" + ph + ")" + Env.Semicolon( env )
        }
        
    //
    // ─── GET OPERATOR ───────────────────────────────────────────────────────────────
    //

        export function TranslateOperator ( op: string ) {
            switch ( op ) {
                case 'sum':         return '+'
                case 'mul':         return '*'
                case 'sub':         return '-'
                case 'div':         return '/'
                case 'and':         return '&&'
                case 'or':          return 'or'
                case 'pow':         return '**'
                case 'mod':         return '%'
                case 'eq':
                case '=':           return '==='
                case '>':           return '>'
                case '<':           return '<'
                case '<=':          return '<='
                case '!=':          return '!='
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}