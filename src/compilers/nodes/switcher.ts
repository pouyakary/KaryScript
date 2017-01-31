
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScriptCompiler.Nodes {

    //
    // ─── NODE SWITCHER ──────────────────────────────────────────────────────────────
    //

        export function CompileNode ( node: Parser.IBase, env: IEnvInfo ) {
            // first we compile the node
            const compiledNodeString = CompilerSwitcher( node, env )
            
            // then we apply the indentation

        }

    //
    // ─── COMPILER SWITCHER ──────────────────────────────────────────────────────────
    //

        function CompilerSwitcher ( node: Parser.IBase, env: IEnvInfo ) {
            switch ( node.type ) {
                case 'Empty':
                    return ''
                case 'Body':
                    return Nodes.Body.Compile( node as Parser.IBody, env )
            }
        }

    //
    // ─── APPLY INDENTATION ──────────────────────────────────────────────────────────
    //

        /** Adds indentation to a compiled string */
        export function ApplyIndentation( code: string ) {
            return code.split( '\n' ).map( x => '   ' + x ).join( '\n' )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}