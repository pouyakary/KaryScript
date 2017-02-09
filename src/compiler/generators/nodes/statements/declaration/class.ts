
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

namespace KaryScript.Compiler.Nodes.ClassDeclaration {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IClassDeclaration, env: IEnvInfo ) {
            const header = GenerateHeader( node, env )

            let defBody = new Array<string>( )
            for ( let def of node.defs ) {
                defBody.push( Nodes.FunctionDeclaration.Compile( def, env, true ) )
            }
            const body = Indentation.AssembleLines( defBody, env ).replace( /^\s+/, '    ' )

            return header + body + '\n}'
        }

    //
    // ─── COMPILE HEADER ─────────────────────────────────────────────────────────────
    //

        function GenerateHeader ( node: AST.IClassDeclaration, env: IEnvInfo ) {
            return HandleExportedKey( node ) + "class "
                    + Nodes.Address.HandleName( node.name )
                    + (( node.origin !== null )?
                        ' extends ' + Address.Compile( node.origin, env ) : '')
                    + ' {\n'
        }

    // ────────────────────────────────────────────────────────────────────────────────

}