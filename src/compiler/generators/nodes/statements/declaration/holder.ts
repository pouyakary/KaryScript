
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />
/// <reference path="../../../../tools/reporter.ts" />

namespace KaryScript.Compiler.Nodes.Holder {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Declare ( node: AST.IHolderDeclarationStatement,
                                   env: IEnvInfo ): CompiledCode {

            env.Holders.set( node.holder.name,
                Nodes.CompileSingleNode( node.value, env ))

            return ''
        }

    //
    // ─── PEAK ───────────────────────────────────────────────────────────────────────
    //

        export function Use ( node: AST.IHolderIdentifier,
                               env: IEnvInfo ): CompiledCode {

            if ( env.Holders.has( node.name ) ) {
                const result = <CompiledCode> env.Holders.get( node.name )
                env.Holders.delete( node.name )
                return result
            } else {
                throw Reporter.Report( env,
                    `No holder as @${ node.name } was found.`, node )
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}