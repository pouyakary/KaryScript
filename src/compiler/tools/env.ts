
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Env {

    //
    // ─── SEMICOLON ──────────────────────────────────────────────────────────────────
    //

        export function Semicolon ( env ) {
            return ( GetParentType( env ) === 'Body' )? ';' : ''
        }

    //
    // ─── GET PARENT TYPE ────────────────────────────────────────────────────────────
    //

        export function GetParentType( env: IEnvInfo ) {
            return env.ParentNode[ env.ParentNode.length - 1 ].type;
        }

    // ────────────────────────────────────────────────────────────────────────────────

}