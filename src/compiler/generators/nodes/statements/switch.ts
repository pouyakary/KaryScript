
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

namespace KaryScript.Compiler.Nodes.Switch {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.ISwitchStatement, env: IEnvInfo ) {
            // header
            const header = "switch (" + Nodes.CompileSingleNode( node.switchable, env )
                            + ") {\n"

            // cases
            let compiledCases = new Array<string>( )
            if ( node.cases )
                for ( let caseStatement of node.cases ) {
                    const cases = caseStatement.cases.map(
                        x => "case " + Nodes.CompileSingleNode( x, env ) + ":" ).join('\n')
                    compiledCases.push(
                        cases + Nodes.CompileSingleNode( caseStatement.body, env)
                              + "\n    break;\n")
                }

            // default case
            if ( node.defaultBody )
                compiledCases.push(
                    "default:\n" + Nodes.CompileSingleNode( node.defaultBody, env ))

            // composing switch:
            return header + compiledCases.join('\n') + '\n}'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}