
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
                const compiledCode = CompileAST( ast )

                return compiledCode
            } catch ( error ) {
                console.log("KaryScript's Compiler Crashed because of this error:")
                console.log( error )
                return null
            }
        }

    //
    // ─── COMPILE FUNCTION ───────────────────────────────────────────────────────────
    //

        /** Gets the parsed AST and compiles it into JavaScript String */
        export function CompileAST ( src: AST.IBody ) {
            // base env info
            let baseEnvInfo: IEnvInfo = {
                ParentNode: [ { type: 'Root' } ],
                ScopeLevel: 0,
                DeclaredIdentifiers: new Set<string>( ),
                Errors: [ ]
            }

            // compiling stuff
            const code =  Nodes.CompileSingleNode( src, baseEnvInfo )

            // checking to see if there is any problem
            if ( baseEnvInfo.Errors.length > 0 )
                throw "Couldn't compile"

            return code
        }

    // ────────────────────────────────────────────────────────────────────────────────

}