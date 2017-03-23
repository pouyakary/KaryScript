
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />

namespace KaryScript.Compiler.Nodes.String {

    //
    // ─── STRING LITERAL ─────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IStringLiteral,
                                   env: IEnv ): SourceMap.SourceNode {

            if ( node.parts.length === 1 )
                if ( node.parts[ 0 ].type === 'StringPart' )
                    return CompileNormalString( node.parts[ 0 ] as AST.IStringPart, env )
                else
                    return env.GenerateSourceNode( node, [
                        Nodes.CompileSingleNode( node.parts[ 0 ], env ), ".toString()"
                    ])

            else
                return CompileStringWithInterpolation( node, env )
        }

    //
    // ─── HANDLE STRING PART ─────────────────────────────────────────────────────────
    //

        function HandleEscapedSequences ( text: string ) {
            return text.replace( /[\/\/\b\f\n\r\t\'\"]/g , x => '\\' + x )
        }

    //
    // ─── COMPILE NORMAL STRING ──────────────────────────────────────────────────────
    //

        function CompileNormalString ( node: AST.IStringPart,
                                        env: IEnv):SourceMap.SourceNode {
            return env.GenerateSourceNode( node, '"' +
                HandleEscapedSequences( node.part ) + '"' )
        }

    //
    // ─── COMPILING STRING WITH INTERPOLATION ────────────────────────────────────────
    //

        function CompileStringWithInterpolation ( node: AST.IStringLiteral,
                                                   env: IEnv ): SourceMap.SourceNode {
        
            let parts = new Array<CompiledCode>( )
            for ( let part of node.parts ) {
                if ( part.type === 'StringPart' )
                    parts.push( HandleEscapedSequences( part.part ) )
                else
                    parts.push( env.GenerateSourceNode( part, [
                        "${",
                        Nodes.CompileSingleNode( part, env ),
                        "}"
                    ]))
            }

            // \x60 is the https://en.wikipedia.org/wiki/Grave_accent used to make
            // template strings in javascript
            return env.GenerateSourceNode( node,
                [ <any> '\x60' ].concat( parts ).concat( '\x60' ))    
        }

    // ────────────────────────────────────────────────────────────────────────────────

}