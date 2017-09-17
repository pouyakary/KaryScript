
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.Declaration {

    //
    // ─── DECLARATION ───────────────────────────────────────────────────────────────
    //

        type TCompile =
            ( node: AST.DeclarationStatementBase, env: IEnv ) => SourceMap.SourceNode
        export const Compile: TCompile = ( node, env ) =>
            ( node.kind === "SingleAllocInit"
                ? CompileSingleAllocInit( node as AST.SingleAllocInitDeclaration , env )
                : CompileMultiAlloc( node as AST.MultiAllocDeclaration, env )
                )

    //
    // ─── SINGLE ALLOC INIT DECLARATION ─────────────────────────────────────────────
    //

        type CompileSingleAllocInit =
            ( node: AST.SingleAllocInitDeclaration, env: IEnv ) => SourceMap.SourceNode
        const CompileSingleAllocInit: CompileSingleAllocInit = ( node, env ) =>
            ( env.ZoneStack.length > 0 && node.exported
                ? CompileExportedAlloc( node, env )
                : CompileSingleAllocForGeneralScope( node, env )
                )

    //
    // ─── MULTI ALLOC DECLARATION ───────────────────────────────────────────────────
    //

        type TCompileMultiAlloc =
                ( node: AST.MultiAllocDeclaration, env: IEnv ) => SourceMap.SourceNode
        const CompileMultiAlloc: TCompileMultiAlloc = ( node, env ) =>
            ( env.ZoneStack.length === 0
                ? CompileNotExportedMultiAlloc( node, env )
                : CompileExportedMultiAlloc( node, env )
                )

    //
    // ─── COMPILE SINGLE ALLOCATION IN CASE OF BEING IN THE GENERAL SCOPE ────────────
    //

        function CompileSingleAllocForGeneralScope ( node: AST.SingleAllocInitDeclaration,
                                                      env: IEnv ): SourceMap.SourceNode {
            let key: string
            if ( node.modifier === 'fix' )
                key = 'const'
            else
                key = GetDeclarationKey( env )

            const name  = Address.CompileIdentifier( node.assignment.name, env )
            const expr  = CompileSingleNode( node.assignment.value, env )

            return env.GenerateSourceNode( node, [  key, " ", name, " = ", expr ])
        }

    //
    // ─── COMPILE EXPORTED ALLOC ─────────────────────────────────────────────────────
    //

        function CompileExportedAlloc ( node: AST.SingleAllocInitDeclaration,
                                         env: IEnv ): SourceMap.SourceNode {

            env.PushZoneIdentifier( env, node.assignment.name )

            const base  = GetBaseName( node.assignment.name, env )
            const expr  = CompileSingleNode( node.assignment.value, env )

            return env.GenerateSourceNode( node, base.concat([ ' = ', expr ]))
        }

    //
    // ─── COMPILE SINGLE ALLOCATION EXPORTED IN ZONE ─────────────────────────────────
    //

        /**
         * When you declare something and you export it (say `export def x = 4`),
         * Based on what ever environment you're doing it, result must be compiled
         * differently:
         * - on global zone &rightarrow; `export var x = 4`
         * - on a zone called _"something_" &rightarrow; `something.x = 4`
         * So this functions provides the base naming point:
         * - `var` __name__
         * - __zone name__ `.` __name__
         */
        function GetBaseName ( name: AST.IIdentifier,
                                env: IEnv ): CompiledCode[ ] {

            const identifier = Address.CompileIdentifier( name, env )

            if ( env.ZoneStack.length === 0 )
                return [ GetDeclarationKey( env ), ' ', identifier ]
            else
                return [ env.ZoneStack[ env.ZoneStack.length - 1 ], '.', identifier ]
        }

    //
    // ─── COMPILE NOT EXPORTED MULTI ALLOC ───────────────────────────────────────────
    //

        function CompileNotExportedMultiAlloc ( node: AST.MultiAllocDeclaration,
                                                 env: IEnv ): SourceMap.SourceNode {

            const key   = GetDeclarationKey( env )
            const names = Join( ', ',
                node.names.map( x => Address.CompileIdentifier( x, env ) ) )

            return env.GenerateSourceNode( node, Concat([ key, " ", names ]) )
        }

    //
    // ─── COMPILE EXPORTED MULTI ALLOC ───────────────────────────────────────────────
    //

        type TCompileExportedMultiAlloc =
            ( node: AST.MultiAllocDeclaration, env: IEnv ) => SourceMap.SourceNode
        const CompileExportedMultiAlloc: TCompileExportedMultiAlloc = ( node, env ) =>
            env.GenerateSourceNode( node,
                Join( '; ',
                    node.names.map( x => {
                        env.PushZoneIdentifier( env, x )
                        return env.GenerateSourceNode( x, GetBaseName( x, env ) )
                    })))

    //
    // ─── GET DECLARATION KEY ───────────────────────────────────────────────────────
    //

        type TGetDeclarationKey = ( env: IEnv ) => 'var' | 'let'
        export const GetDeclarationKey: TGetDeclarationKey = env =>
            ( env.ParentNode.length === 3
                ? 'var'
                : 'let'
                )

    // ────────────────────────────────────────────────────────────────────────────────

}