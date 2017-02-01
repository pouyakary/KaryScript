
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
            message: string
            kind: ErrorTypes
            node: AST.IBase | null
        }

    //
    // ─── REPORTER STORAGE ───────────────────────────────────────────────────────────
    //

        let reports = new Array<CompilerError>( )

    //
    // ─── REPORT TYPES ───────────────────────────────────────────────────────────────
    //

        export enum ErrorTypes {
            Grammar, Report, Identifier
        }
        
    //
    // ─── REPORTER ───────────────────────────────────────────────────────────────────
    //

        export function Report ( env: IEnvInfo, message: string, kind: ErrorTypes,
                                node?: AST.IBase ) {
            env.Errors.push({
                message: message,
                kind: kind,
                node: ( node )? node : null
            })
        }

    // ────────────────────────────────────────────────────────────────────────────────

}