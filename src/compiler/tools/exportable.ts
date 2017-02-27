
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
    // ─── EXPORTABLE ─────────────────────────────────────────────────────────────────
    //

        export function HandleExportedKey ( node: AST.IExportable,
                                             env: IEnv,
                                            name: string,
                                            code: CompiledCode[ ] ): SourceMap.SourceNode {
            // if needs no export
            if ( !node.exported )
                return env.GenerateSourceNode( node, code )

            // if needs to be exported in zone
            let result: IExportPart
            if ( env.ZoneStack.length > 0 )
                result =  {
                    type: 'end',
                    value: `; ${ env.ZoneStack[ env.ZoneStack.length - 1 ]}.${ name } = ${ name }`
                }
            else
                result = {
                    type: 'start',
                    value: 'export '
                }
        
            // done
            if ( result.type === 'start')
                return env.GenerateSourceNode( node,
                    ( [ result.value ] as CompiledCode[ ] ).concat( code )
                )
            else 
                return env.GenerateSourceNode( node,
                    code.concat([ result.value ])
                )
        }

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        interface IExportPart {
            type: 'end' | 'start'
            value: string
        }

    // ────────────────────────────────────────────────────────────────────────────────

}