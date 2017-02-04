
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="identifier.ts" />
/// <reference path="address.ts" />
/// <reference path="../../../tools/reporter.ts" />
/// <reference path="../../../tools/env.ts" />


namespace KaryScript.Compiler.Nodes.SExpression {

    //
    // ─── S EXPRESSION ───────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISExpression, env: IEnvInfo, 
                                  placeholder?: AST.IBase ) {
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
                    return CompileUnaryOperator( node as AST.IUnaryOperatorSExpression, env )

                case 'FunctionCallOnly':
                    return CompileFunctionCallOnly( node as AST.IFunctionCallOnlySExpression, env )
            }
        }

    //
    // ─── FUNCTION CALL WITH ARGS ────────────────────────────────────────────────────
    //

        function CompileFunctionCallWithArgs ( node: AST.IFunctionCallWithArgsSExpression, 
                                                env: IEnvInfo, 
                                       placeholder?: AST.IBase ) {
            // compiling args
            let args = new Array<string>( )
            for ( let arg of node.params ) {
                if ( arg.type === 'PipePlaceholder' && placeholder )
                    args.push( Nodes.CompileSingleNode( placeholder, env ) )
                else
                    args.push( Nodes.CompileSingleNode( arg, env ) )
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
                                  placeholder?: AST.IBase ) {

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
                                         env: IEnvInfo ) {
            return node.operator + " (" + Nodes.CompileSingleNode( node.arg, env ) + 
                    ")" + Env.Semicolon( env )
        }

    //
    // ─── SIMPLE FUNCTION CALL ───────────────────────────────────────────────────────
    //

        function CompileFunctionCallOnly ( node: AST.IFunctionCallOnlySExpression,
                                            env: IEnvInfo ) {
            return Address.Compile( node.command, env ) + "()" + Env.Semicolon( env )
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
                case '=':           return '==='
                case '>':           return '>'
                case '<':           return '<'
                case '<=':          return '<='
                case '!=':          return '!='
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}