
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/reporter.ts" />

namespace KaryScript.Compiler.Nodes.RegExpLiteral {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IRegExpLiteral, env: IEnv ) {
            if ( !CheckRegExp( node, env ) ) return ''

            return `/${ node.pattern }/${ node.flags }`
        }

    //
    // ─── PERFORM REGEXP CHECKS ──────────────────────────────────────────────────────
    //

        function CheckRegExp ( node: AST.IRegExpLiteral, env: IEnv ) {
            try {
                new RegExp( node.pattern, node.flags )
                return true
            } catch ( e ) {
                Reporter.Report( env, node, e.toString( ) )
                return false   
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}