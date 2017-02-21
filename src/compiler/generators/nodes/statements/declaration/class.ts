
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="function.ts" />
/// <reference path="../../../../tools/exportable.ts" />
/// <reference path="../../expressions/address.ts" />
/// <reference path="../../../../tools/indent.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.ClassDeclaration {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IClassDeclaration,
                                   env: IEnvInfo ): SourceMap.SourceNode {
            const header = GenerateHeader( node, env )

            let defBody = new Array<SourceMap.SourceNode>( )
            for ( let def of node.defs )
                defBody.push( env.GenerateSourceNode( def, 
                    Nodes.FunctionDeclaration.Compile( def, env, true ) ) )

            return env.GenerateSourceNode( node, Concat([ header, defBody, '}' ]))
        }

    //
    // ─── COMPILE HEADER ─────────────────────────────────────────────────────────────
    //

        function GenerateHeader ( node: AST.IClassDeclaration,
                                   env: IEnvInfo ): SourceMap.SourceNode {
            return env.GenerateSourceNode( node, [
                HandleExportedKey( node ),
                "class ",
                Nodes.Address.CompileIdentifier( node.name, env ),
                (( node.origin !== null )?
                    env.GenerateSourceNode( node.origin,[
                        ' extends ',  Address.Compile( node.origin, env )]) : ''),
                ' {'
            ])
        }

    // ────────────────────────────────────────────────────────────────────────────────

}