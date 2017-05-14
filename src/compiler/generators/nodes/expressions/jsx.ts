
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/reporter.ts" />
/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.JSX {

    //
    // ─── JSX ────────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IJSXExpression, env: IEnv ): SourceMap.SourceNode {
            if ( node.body.length === 0 )
                return compileTerminalJSXTag( node, env )
            else
                return compileNestedJSXTag( node, env )
        }

    //
    // ─── COMPILED TERMINAL JSX ──────────────────────────────────────────────────────
    //

        function compileTerminalJSXTag ( node: AST.IJSXExpression,
                                          env: IEnv ): SourceMap.SourceNode {
            const name = Nodes.CompileSingleNode( node.name, env )
            return env.GenerateSourceNode( node, Concat([
                "<", name, compileProperties( node.props, env ), "/>"
            ]))
        }

    //
    // ─── COMPILE NESTED JSX ─────────────────────────────────────────────────────────
    //

        function compileNestedJSXTag ( node: AST.IJSXExpression,
                                        env: IEnv ): SourceMap.SourceNode {
            const name = Nodes.CompileSingleNode( node.name, env )
            const body = compileBody( node.body, env )
            return env.GenerateSourceNode( node, Concat([
                "<", name, compileProperties( node.props, env ), ">",
                body,
                "</", name, ">"
            ]))
        }

    //
    // ─── COMPILE BODY ───────────────────────────────────────────────────────────────
    //

        function compileBody ( body: AST.TJSXBodyParts[ ], env: IEnv ): CompiledCode[ ] {
            return body.map( x => {
                if ( x.type === 'StringPart' )
                    return compileJSXBodyString( x as AST.IStringPart )

                else if ( x.type === "JSX" )
                    return Nodes.CompileSingleNode( x, env )

                else
                    return env.GenerateSourceNode( x, [
                        '{', Nodes.CompileSingleNode( x, env ) ,'}'
                    ])
            })
        }

    //
    // ─── COMPILE JSX STRINGS ────────────────────────────────────────────────────────
    //

        function compileJSXBodyString ( node: AST.IStringPart ) {
            return node.part.replace( /[\/\/\b\f\r\t\'\"]/g , x => '\\' + x )
        }

    //
    // ─── COMPILE PROPERTIES ─────────────────────────────────────────────────────────
    //

        function compileProperties ( props: AST.IJSXProperty[ ], env: IEnv ) {
            return props.map( x => compileJSXProperty( x, env ) )
        }

    //
    // ─── COMPILE PROPERTY ───────────────────────────────────────────────────────────
    //

        function compileJSXProperty ( prop: AST.IJSXProperty, env: IEnv ) {
            const name  = Address.CompileIdentifier( prop.name, env )
            const value = Nodes.CompileSingleNode( prop.value, env )

            console.log( prop.value, value)

            const braces = ((prop.value.type === "StringLiteral")?
                { l: '', r: '' } : { l: '{', r: '}' })

            return env.GenerateSourceNode( prop, [
                ' ', name, '=', braces.l, value, braces.r ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}