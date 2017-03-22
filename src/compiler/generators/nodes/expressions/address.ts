
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

        export function Compile ( node: AST.IBase, env: IEnv ): SourceMap.SourceNode {
            let result: CompiledCode
            if ( node.type === 'AddressIdentifier' )
                result = CompileAddressIdentifier( node as AST.IAddressIdentifier, env )
            else
                result = CompileFullIdentifer( node as AST.IIdentifier, env )

            return env.GenerateSourceNode( node, result )
        }

    //
    // ─── COMPILE ADDRESS ────────────────────────────────────────────────────────────
    //

        function CompileAddressIdentifier ( node: AST.IAddressIdentifier, env: IEnv ) {
            let address: SourceMap.SourceNode[ ] = [ ]
            for ( let index = 0; index < node.address.length; index++ ) {
                let element = node.address[ index ]
                if ( index == 0 )
                    address.push( CompileFullIdentifer( element, env ) )
                else
                    address.push( CompileIdentifier( element, env ) )
            }
            return env.GenerateSourceNode( node, Join('.', address ) )
        }

    //
    // ─── COMPILE IDENTIFIER NAME ────────────────────────────────────────────────────
    //

        export function CompileIdentifier ( node: AST.IIdentifier, env: IEnv ) {
            return env.GenerateSourceNode( node,
                node.name.replace( /-/g, '_' ), node.name )
        }

    //
    // ─── GET FULL IDENTIFER ─────────────────────────────────────────────────────────
    //

        export function CompileFullIdentifer ( node: AST.IIdentifier, env: IEnv ) {
            let base = ''
            if ( env.ZoneStack.length > 0 ) {
                const baseResult = SearchZoneBaseForIdentifier( node.name, env )
                base = baseResult? baseResult + '.' : ''
            }

            const resultingName = base + node.name.replace( /-/g, '_' )

            return env.GenerateSourceNode( node, resultingName, node.name )
        }

    //
    // ─── SEARCH IN ZONE ─────────────────────────────────────────────────────────────
    //

        export function SearchZoneBaseForIdentifier ( name: string, env: IEnv ) {
            function search ( name: string, zone: string, env: IEnv ) {
                const data = env.ZoneIdentifiers[ zone ]
                const query = data.zoneIdentifiers.find( x => x === name )
                if ( query != null && query != undefined )
                    return zone
                else
                    if ( data.parentZoneId != null )
                        return search( name, data.parentZoneId, env )
                    else
                        return null
            }
            return search( name, <string> env.GetZoneId( env ), env )
        }

    //
    // ─── NORMALIZE NAME ─────────────────────────────────────────────────────────────
    //

        export function NormalizeName ( node: AST.IIdentifier ) {
            return node.name.replace( /-/g, '_' )
        }
    
    // ────────────────────────────────────────────────────────────────────────────────

}