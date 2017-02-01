
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

        /** Compiles a simple given node */
        export function CompileSingleNode ( node: Parser.IBase, env: IEnvInfo ): string {
            switch ( node.type ) {
                case 'Body':
                    return Nodes.Body.Compile( node as Parser.IBody, env )

                case 'Empty':
                default:
                    return ''
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}