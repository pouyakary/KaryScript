
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScriptCompiler {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        /**
         * This is the main function of KaryScript Compiler. It takes a _String_ of
         * __KaryScript Source Code__ containing the __"Content of a single source file"__
         * and compiles it to a JavaScript String or throws CompilerErrors
         */
        export function Compile( src: string ) {
            try {
                // parsing
                const parser = require( './parser.js' )
                const ast = parser.parse( src ) as AST.IBody
                // generating the code
                const compiledCode = CompileAST( ast )
            } catch ( error ) {
                
            }
        }

    //
    // ─── COMPILE FUNCTION ───────────────────────────────────────────────────────────
    //

        /** Gets the parsed AST and compiles it into JavaScript String */
        export function CompileAST ( src: AST.IBody ) {

        }

    //
    // ─── BASE COMPILATION SCOPE INFORMATION OBJECT ──────────────────────────────────
    //

        /**
         * The information object that is passed to the __child branches__ for a Body
         * node to have information about it's _parent object_ as well as _environment_
         */
        export interface IEnvInfo {
            /** Shows the level of scope depth */
            ScopeLevel: number

            /**
             * A __Stack of Parent Nodes__ so that you can have a clear view
             * on compilation should happen
             */
            ParentNode: AST.IBase[ ]

            /**
             * Defined Identifiers. Keeps a stack of defined identifiers within scopes
             */
            DeclaredIdentifiers: Set<String>
        }

    // ────────────────────────────────────────────────────────────────────────────────

}