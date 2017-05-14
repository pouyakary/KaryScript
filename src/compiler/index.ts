
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="version.ts" />
/// <reference path="generators/nodes/blocks/root.ts" />
/// <reference path="tools/reporter.ts" />
/// <reference path="../typings/source-map.ts" />
/// <reference path="tools/base-env.ts" />

namespace KaryScript.Compiler {

    //
    // ─── COMPILE ────────────────────────────────────────────────────────────────────
    //

        /**
         * This is the main function of KaryScript Compiler. It takes a _String_ of
         * __KaryScript Source Code__ containing the __"Content of a single source file"__
         * and compiles it to a JavaScript String or throws CompilerErrors
         */
        export function Compile ( src: string,
                             filename: string ): SourceMap.CodeWithSourceMap {
            try {
                // imports
                const parser = require( './parser.js' )
                const sourceMap = require( 'source-map' )

                // base env info
                let baseEnvInfo = GetBaseEnvObjectClone( filename, sourceMap )

                console.log(filename)
                // parsing code
                let ast
                try {
                    console.time('parse')
                    ast = parser.parse( src ) as AST.IBody
                    console.timeEnd('parse')
                } catch ( parserError ) {
                    throw Reporter.WrapParserError( baseEnvInfo, parserError as Reporter.ICompilerError )
                }
                
                // generating code
                try {
                    console.time('compile')
                    let result = CompileAST( ast, filename, sourceMap, baseEnvInfo )
                    console.timeEnd('compile')
                    return result
                } catch ( codeErrors ) {
                    //throw Reporter.HandleCodeErrorsAtCompileEnd( codeErrors )
                    throw codeErrors
                }

            } catch ( crashError ) {
                throw Reporter.WrapReturnErrorsAtTheEnd( crashError )
            }
        }

    //
    // ─── COMPILE FUNCTION ───────────────────────────────────────────────────────────
    //

        /** Gets the parsed AST and compiles it into JavaScript String */
        export function CompileAST ( src: AST.IRoot,
                                filename: string,
                               sourceMap: any,
                             baseEnvInfo: IEnv ): SourceMap.CodeWithSourceMap {

            // compiling
            let code: null | SourceMap.SourceNode = null
            try {
                // compiling stuff
                let result = <SourceMap.SourceNode> Nodes.Root.Compile(
                                src as AST.IRoot, baseEnvInfo )

                // handling errors
                if ( baseEnvInfo.Errors.size > 0 )
                    throw baseEnvInfo.Errors

                // a big problem that can happen
                if ( typeof result === "string" )
                    result = new sourceMap.SourceNode( 0, 0, filename, result )

                return result.toStringWithSourceMap( )

            } catch ( error ) {
                throw error
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
    // ─── SOURCE RESULT ──────────────────────────────────────────────────────────────
    //

        export type CompiledCode = String | SourceMap.SourceNode

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