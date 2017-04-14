//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../../../interfaces/envinfo.ts" />
/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.SingleAssignment {

    //
    // ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISingleAssignmentStatement,
                                   env: IEnv ): SourceMap.SourceNode {

            const name  = Nodes.CompileSingleNode( node.name, env )
            const value = Nodes.CompileSingleNode( node.value, env )

            let compiledCodeArray = new Array<CompiledCode>( )

            switch ( node.key ) {
                case '=':
                    compiledCodeArray = CompileSingleAssignment( name, value, env )
                    break

                case '/=':
                    compiledCodeArray = CompileSlashAssignment( name, value, env )
                    break

                case '?=':
                    compiledCodeArray = CompileNullCheckAssignment( name, value, env )
                    break
            }

            return env.GenerateSourceNode( node, compiledCodeArray )
        }

    //
    // ─── COMPILE SIMPLE ASSIGNMENT ──────────────────────────────────────────────────
    //

        function CompileSingleAssignment ( name: CompiledCode,
                                          value: CompiledCode,
                                            env: IEnv ) {
            return [
                name, ' = ', value
            ]
        }

    //
    // ─── COMPILE SLASH ASSIGNMENTS ──────────────────────────────────────────────────
    //

        function CompileSlashAssignment ( name: CompiledCode,
                                         value: CompiledCode,
                                           env: IEnv ) {
            return [
                name, ' = ', name, '.', value
            ]
        }

    //
    // ─── COMPILE NULL CHECK ASSIGN ──────────────────────────────────────────────────
    //

        function CompileNullCheckAssignment ( name: CompiledCode,
                                             value: CompiledCode,
                                               env: IEnv ) {
            return [
                'if (', name , ' === null || ', name , ' === undefined) {',
                    name , ' = ',value,
                '}'
            ]
        }

    // ────────────────────────────────────────────────────────────────────────────────

}