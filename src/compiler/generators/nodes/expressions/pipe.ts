
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
/// <reference path="./s-expression.ts" />

namespace KaryScript.Compiler.Nodes.Pipe {

    //
    // ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IPipeExpression,
                                   env: IEnv ): SourceMap.SourceNode {

            env.ParentNode.push( node )
            const code =
                env.GenerateSourceNode( node, CompileLevelsArray( node.levels.reverse( ), env ))

            env.ParentNode.pop( )
            return code
        }

    //
    // ─── RECURSIVE PIPE COMPILER ────────────────────────────────────────────────────
    //

        function CompileLevelsArray ( levels: AST.IBase[ ],
                                         env: IEnv ): CompiledCode {
            if ( levels.length === 2 )
                return SExpression.Compile(
                    <AST.ISExpression> levels[ 0 ], env, levels[ 1 ] )

            else
                return SExpression.Compile( <AST.ISExpression> levels[ 0 ], env,
                        <string> CompileLevelsArray( levels.splice( 1 ), env ) )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}
