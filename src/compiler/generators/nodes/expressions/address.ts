
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.Address {

    //
    // ─── ADDRESS ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IBase, env: IEnvInfo ): SourceMap.SourceNode {
            let result: CompiledCode
            if ( node.type === 'AddressIdentifier' )
                result = env.GenerateSourceNode( node, 
                    Join('.', ( node as AST.IAddressIdentifier ).address
                        .map( x => CompileIdentifier( x, env ))))
            else
                result = CompileIdentifier( node as AST.IIdentifier, env )

            return env.GenerateSourceNode( node, result )
        }

    //
    // ─── COMPILE IDENTIFIER NAME ────────────────────────────────────────────────────
    //

        export function CompileIdentifier ( node: AST.IIdentifier, env: IEnvInfo ) {
            return env.GenerateSourceNode( node, node.name.replace( /-/g, '_' ), node.name )
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}