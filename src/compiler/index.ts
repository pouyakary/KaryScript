
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="version.ts" />
/// <reference path="generators/switcher.ts" />
/// <reference path="tools/reporter.ts" />


namespace KaryScript.Compiler {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        /**
         * This is the main function of KaryScript Compiler. It takes a _String_ of
         * __KaryScript Source Code__ containing the __"Content of a single source file"__
         * and compiles it to a JavaScript String or throws CompilerErrors
         */
        export function Compile( src: string ): string | null {
            try {
                // parsing
                const parser = require( './parser.js' )
                const ast = parser.parse( src ) as AST.IBody
                
                // generating the code
                try {
                    return CompileAST( ast )

                } catch ( codeErrors ) {
                    throw Reporter.HandleCodeErrorsAtCompileEnd( codeErrors )
                }

            } catch ( crashError ) {
                throw Reporter.WrapReturnErrorsAtTheEnd( crashError )
            }
        }

    //
    // ─── COMPILE FUNCTION ───────────────────────────────────────────────────────────
    //

        /** Gets the parsed AST and compiles it into JavaScript String */
        export function CompileAST ( src: AST.IBody ): string {
            // base env info
            let baseEnvInfo: IEnvInfo = {
                ParentNode: [ Object.assign({ }, BaseNodeObject ) ],
                ScopeLevel: 0,
                DeclaredIdentifiers: new Set<string>( ),
                Errors: new Set( ),
                Format: {
                    PrintComments: true
                }
            }

            let code = ""
            try {
                // compiling stuff
                code =  Nodes.CompileSingleNode( src, baseEnvInfo )
            } finally {
                if ( baseEnvInfo.Errors.size > 0 )
                    throw baseEnvInfo.Errors
                
                return code
            }
        }

    //
    // ─── BASE OBJECTS ───────────────────────────────────────────────────────────────
    //

        export const BaseNodeObject: AST.IBase = {
            type: 'Root',
            id: 'R00000',
            location: {
                start: { offset: 0, column: 0, line: 0 },
                end: { offset: 0, column: 0, line: 0 }
            }
        }

    //
    // ─── BASE ───────────────────────────────────────────────────────────────────────
    //

        export type TBase = AST.IBase | string

    //
    // ─── RETURN ERRORS ──────────────────────────────────────────────────────────────
    //

        export interface IFinalError {
            from: 'user' | 'compiler',
            errors: any[ ]
        }

    // ────────────────────────────────────────────────────────────────────────────────

}