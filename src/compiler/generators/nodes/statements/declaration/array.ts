
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="variable.ts" />
/// <reference path="../../literals/array.ts" />
/// <reference path="../../../../tools/exportable.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.ArrayDeclaration {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        type TCompile =
            ( node: AST.IArrayDeclaration, env: IEnv ) => SourceMap.SourceNode
        export const Compile: TCompile = ( node, env ) =>
            HandleExportedKey( node, env, Address.NormalizeName( node.name ),
                Concat([
                    Nodes.Declaration.GetDeclarationKey( env ),
                    " ",
                    Nodes.Address.CompileIdentifier( node.name, env ),
                    " = ",
                    Nodes.ArrayLiteral.Compile( node, env )
                ])
            )

    // ────────────────────────────────────────────────────────────────────────────────

}