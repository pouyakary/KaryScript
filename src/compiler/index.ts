
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
/// <reference path="../typings/source-map.ts" />

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
                             filename: string ): SourceMap.SourceNode | null {
            try {
                // imports
                const parser = require( './parser.js' )

                // parsing
                const ast = parser.parse( src ) as AST.IBody
                
                // generating the code
                try {
                    return CompileAST( ast, filename )

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
        export function CompileAST ( src: AST.IBody,
                                filename: string ) {
            // imports
            const sourceMap = require( 'source-map' )

            // base env info
            let baseEnvInfo: IEnv = {
                
                ParentNode: [
                    Object.assign({ }, BaseNodeObject )
                ],

                ScopeLevel: 0,
                Holders: new Map<string, CompiledCode>( ),
                DeclaredIdentifiers: new Set<string>( ),
                Errors: new Set( ),

                GenerateSourceNode: ( node, chunk, name = undefined ) => 
                    <SourceMap.SourceNode> new sourceMap.SourceNode(
                        node.location.start.line,
                        node.location.start.column,
                        filename,
                        chunk,
                        name ),

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

                Format: {
                    PrintComments: true
                }
            }

            // compiling
            let code: null | SourceMap.SourceNode = null
            try {
                // compiling stuff
                const result = <SourceMap.SourceNode> Nodes.CompileSingleNode( src, baseEnvInfo )

                // handling errors
                if ( baseEnvInfo.Errors.size > 0 )
                    throw baseEnvInfo.Errors

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