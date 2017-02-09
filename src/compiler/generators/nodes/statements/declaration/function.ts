
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />
/// <reference path="../../../../tools/exportable.ts" />

namespace KaryScript.Compiler.Nodes.FunctionDeclaration {

    //
    // ─── FUNCTION DECLARATION ───────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IFunctionDeclaration,
                                   env: IEnvInfo,
                               classDef = false ) {

            const functionName = Address.HandleName( node.name )
            const functionKey = HandleExportedKey( node )
                                + (( node.key === 'def' )? '' : 'async ')
                                + (( classDef )? '' : 'function ')
            let args = ''
            if ( node.args !== null )
                args = node.args.map( arg => Address.HandleName( arg ) ).join(', ')
            const body = Nodes.CompileSingleNode( node.code, env )
            return functionKey + " " + functionName + "(" + args + ") {" + body + "\n}"
        }

    // ────────────────────────────────────────────────────────────────────────────────

}