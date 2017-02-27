
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.Reporter {

    //
    // ─── ERROR INTERFACE ────────────────────────────────────────────────────────────
    //

        export interface CompilerError {
            message:    string
            location:   AST.ILocation
        }
        
    //
    // ─── REPORTER ───────────────────────────────────────────────────────────────────
    //

        export function Report ( env: IEnv,
                                node: AST.IBase,
                             message: string ) {
            env.Errors.add({
                message: message,
                location: Object.assign({ }, node.location )
            })
        }

    //
    // ─── HANDLE COMPILER ERRORS AT THE END OF COMPILE ───────────────────────────────
    //

        export function HandleCodeErrorsAtCompileEnd ( errors: any[ ] ) {
            return {
                from: 'user',
                errors: errors
            }
        }

    //
    // ─── WRAP ERRORS ────────────────────────────────────────────────────────────────
    //

        function WrapErrors ( errors: CompilerError[ ] ) {
            if ( typeof errors === "object" )
                return errors
            else
                return Array.from( new Set( errors ) )
        }

    //
    // ─── RETURN ERRORS AT FINALE ────────────────────────────────────────────────────
    //

        export function WrapReturnErrorsAtTheEnd ( error: any ) {
            if ( error.from === 'user' )
                return WrapErrors( error )
            else
                return {
                    from: 'compiler',
                    errors: [ error ]
                }
        }
    
    //
    // ─── CONCAT ERRORS ──────────────────────────────────────────────────────────────
    //

        export function ConcatEnvErrors ( origin: IEnv, additions: IEnv ) {
            for ( let err of additions.Errors )
                origin.Errors.add( err )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}