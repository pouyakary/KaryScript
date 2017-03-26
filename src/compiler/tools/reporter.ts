
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

        export interface ICompilerError {
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
    // ─── RETURN ERRORS AT FINALE ────────────────────────────────────────────────────
    //

        export function WrapReturnErrorsAtTheEnd ( error: IErrorBox ) {
            if ( error.from === 'user' || error.from === 'parser' )
                return error
            else
                return {
                    from: 'compiler',
                    errors: [ error ]
                }
        }

    //
    // ─── WRAP PARSER ERRORS ─────────────────────────────────────────────────────────
    //

        export function WrapParserError ( env: IEnv, error: ICompilerError ) {
            return {
                location: error.location,
                message: `L${ error.location.start.line }C${ error.location.start.column }: ${ error.message }`
            }
        }
    
    //
    // ─── CONCAT ERRORS ──────────────────────────────────────────────────────────────
    //

        export function ConcatEnvErrors ( origin: IEnv, additions: IEnv ) {
            for ( let err of additions.Errors )
                origin.Errors.add( err )
        }

    //
    // ─── ERROR TYPE ─────────────────────────────────────────────────────────────────
    //

        export interface IErrorBox {
            from: 'user' | 'compiler' | 'parser'
            errors: ICompilerError[ ]
        }

    // ────────────────────────────────────────────────────────────────────────────────

}