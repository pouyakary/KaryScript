
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//


namespace KaryScript.Compiler.Nodes.Address {

    //
    // ─── ADDRESS ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IBase, env: IEnvInfo ) {
            if ( node.type === 'AddressIdentifier' )
                return ( node as AST.IAddressIdentifier ).address
                    .map( x => x.replace( /-/g, '_' ) )
                    .join('.')
            else
                return HandleName( ( node as AST.IIdentifier ).name )
        }

    //
    // ─── COMPILE IDENTIFIER NAME ────────────────────────────────────────────────────
    //

        export function HandleName ( name: string ) {
            return name.replace( /-/g, '_' )
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}