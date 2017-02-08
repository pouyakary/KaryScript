

//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../switcher.ts" />
/// <reference path="../expressions/address.ts" />
/// <reference path="../../../tools/indent.ts" />

namespace KaryScript.Compiler.Nodes.ObjectLiteral {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IObjectLiteral, env: IEnvInfo ) {
            return '{\n' +
                Indentation.AssembleLines(
                    node.value.map( x => CompileObjectPair( x, env ) + ',\n' ),
                    env )
                + '\n}'
        }

    //
    // ─── COMPILE OBJECT PAIR ────────────────────────────────────────────────────────
    //

        export function CompileObjectPair ( pair: AST.IObjectMemberPair, env: IEnvInfo ) {
            return Nodes.Address.HandleName( pair.key ) + ": " +
                Nodes.CompileSingleNode( pair.value, env )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}