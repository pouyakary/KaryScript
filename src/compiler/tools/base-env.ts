
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler {

    //
    // ─── BASE ENV ───────────────────────────────────────────────────────────────────
    //

        export function GetBaseEnvObjectClone ( filename: string,
                                               sourceMap: any ): IEnv {

            return {
                
                //
                // PARENT NODE
                //

                ParentNode: [
                    Object.assign({ }, BaseNodeObject )
                ],

                //
                // SCOPE LEVEL
                //

                ScopeLevel: 0,

                //
                // HOLDERS
                //

                Holders: new Map<string, CompiledCode>( ),

                //
                // DECLARED IDENTIFIERS
                //

                DeclaredIdentifiers: new Set<string>( ),

                //
                // ERRORS REPO
                //

                Errors: new Set( ),

                //
                // GENERATE SOURCE NODE
                //

                GenerateSourceNode: ( node, chunk, name = undefined ) => 
                    <SourceMap.SourceNode> new sourceMap.SourceNode(
                        node.location.start.line,
                        node.location.start.column,
                        filename,
                        chunk,
                        name ),

                //
                // ZONE INFO
                //

                ZoneStack: [ ],
                ZoneIdentifiers: { },

                PushZoneIdentifier: ( env: IEnv, name: AST.IIdentifier ) => {
                    const zoneId = env.ZoneStack.join('/')
                    const nameId = name.name.replace(/-/g, '_')
                    env.ZoneIdentifiers[ zoneId ].zoneIdentifiers.push( nameId )
                },

                GetZoneId: ( env: IEnv ) => {
                    if ( env.ZoneStack.length === 0 )
                        return null
                    return env.ZoneStack.join('/')
                },

                //
                // FORMATTER
                //

                Format: {
                    PrintComments: true
                }
            }

        }

    // ────────────────────────────────────────────────────────────────────────────────

}