
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
    // ─── CONCATABLE ─────────────────────────────────────────────────────────────────
    //

        export type TConcatable = ( CompiledCode[ ] | CompiledCode )[ ]
        
        type TConcatableNotNullable = CompiledCode[ ] | CompiledCode

    //
    // ─── CONCAT ─────────────────────────────────────────────────────────────────────
    //

        /** For concatenating SourceNode parts */
        export function Concat ( parts: TConcatable ) {
            let result = new Array<CompiledCode>( )
            for ( const part of parts ) {
                result = result.concat( part )
            }
            return result.filter( x => x !== undefined )
        }

    //
    // ─── CONTACT WITH COMMAS ────────────────────────────────────────────────────────
    //

        export function Join ( joiner: string, parts: TConcatable ): CompiledCode[ ] {
            let results = new Array<CompiledCode>( )
            results = results.concat( parts[ 0 ] )
            for ( const part of parts.splice( 1 ) ) {
                results.push( joiner )
                results = results.concat( part )
            }
            return results
        }

    // ────────────────────────────────────────────────────────────────────────────────

}