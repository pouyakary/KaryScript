
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Nodes.ZoneDeclaration {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IZoneDeclaration, env: IEnv ) {
            if ( node.kind === "named" )
                return CompileNamedZoneNode( node as AST.INamedZone, env )
            else
                return CompileSimpleZoneNode( node as AST.ISimpleZone, env )
        }

    //
    // ─── COMPILE SIMPLE NODE ZONE ───────────────────────────────────────────────────
    //

        function CompileSimpleZoneNode ( node: AST.ISimpleZone, env: IEnv ) {
            return env.GenerateSourceNode( node, [
                '(function() {', Nodes.CompileSingleNode( node, env ), '})()'])
        }

    //
    // ─── COMPILE NAMED ZONE ─────────────────────────────────────────────────────────
    //

        function CompileNamedZoneNode ( node: AST.INamedZone, env: IEnv ) {
            const address = (( node.name.type === 'Identifier' )?
                                [ node.name as AST.IIdentifier ] :  node.name.address )
            return env.GenerateSourceNode( node,
                RecursiveZoneCompiler( address, node.body, env ))
        }

    //
    // ─── RECURSIVE ZONE COMPILER ────────────────────────────────────────────────────
    //

        export function RecursiveZoneCompiler ( address: AST.IIdentifier[ ],
                                                   body: AST.IBody,
                                                    env: IEnv ) {
            // zone name
            const name = GetRightName( address[ 0 ] )

            // header
            let chunk: CompiledCode[ ] = [
                `var ${ name }; (function (${ name }) {`
            ]

            // body
            UpdateEnvWithZone( env, name )
            if ( address.length === 1 ) {
                chunk.push(
                    Nodes.CompileSingleNode( body, env ) )
            } else {
                chunk = chunk.concat(
                    ZoneDeclaration.RecursiveZoneCompiler(
                        address.slice( 1 ), body, env ) )
                chunk.push('; ')
            }
            env.ZoneStack.pop( )

            // the ending phrase
            if ( env.ZoneStack.length === 0 ) {
                chunk.push(
                    `})(${ name } || (${ name } = {}))`)
            } else {
                const compiledParentName = env.ZoneStack[ env.ZoneStack.length - 1 ]
                chunk.push(
                    `})(${ name } = ${ compiledParentName }.${ name } || (${
                    compiledParentName }.${ name } = {}))`)
            }

            // done
            return chunk
        }

    //
    // ─── UPDATE ENV WITH ZONE ───────────────────────────────────────────────────────
    //

        function UpdateEnvWithZone ( env: IEnv, name: string ) {
            // getting the parent
            const parentZoneId = env.GetZoneId( env )

            // pushing self
            env.ZoneStack.push( name )

            // pushing zone into zone identifier listing 
            env.ZoneIdentifiers[ <string> env.GetZoneId( env ) ] = {
                zoneId: <string> env.GetZoneId( env ),
                parentZoneId: parentZoneId,
                zoneIdentifiers: [ ]
            }
        }

    //
    // ─── GET NAME ───────────────────────────────────────────────────────────────────
    //

        function GetRightName ( name: AST.IIdentifier ) {
            return name.name.replace( /\-/g, '_' )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}