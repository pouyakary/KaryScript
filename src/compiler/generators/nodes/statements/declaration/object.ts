
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="variable.ts" />
/// <reference path="../../literals/object.ts" />
/// <reference path="../../../../tools/exportable.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.ObjectDeclaration {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IObjectDeclaration,
                                   env: IEnvInfo ): SourceMap.SourceNode {
            return env.GenerateSourceNode( node, Concat([
                HandleExportedKey( node ),
                (( node.kind === 'object' )?
                    Nodes.Declaration.GetDeclarationKey( env ) : 'const'),
                " ",
                Nodes.Address.CompileIdentifier( node.name, env ),
                " = ",
                Nodes.ObjectLiteral.Compile( node, env )
            ]))
        }

    // ────────────────────────────────────────────────────────────────────────────────

}