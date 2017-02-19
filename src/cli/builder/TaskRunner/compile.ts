
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.CLI.Builder.TaskRunner {

    //
    // ─── COMPILE WITH SETTINGS ──────────────────────────────────────────────────────
    //

        export function BuildSingleFile ( file: string,
                                      settings: Settings.IBuildSettings ) {
            try {
                // reading the file
                const fileString = fs.readFileSync( file, 'utf8' )

                // out file GetNewAddress
                const outFileAddress = GetNewAddress( settings, file )

                // dam dasharray! this is the very big moment!
                let compiledCode = (<SourceMap.SourceNode>
                     KaryScript.Compiler.Compile( fileString, file ))
                     .toStringWithSourceMap( )

                // applying source map
                const codeAfterHandlingSourceMap =
                    HandleSourceMap( outFileAddress, settings, compiledCode )

                // saving the file
                fs.writeFileSync( outFileAddress, codeAfterHandlingSourceMap )

            } catch ( e ) {

            }
        }
    
    //
    // ─── APPLY SOURCE MAP ───────────────────────────────────────────────────────────
    //

        function HandleSourceMap ( filePath: string,
                                   settings: Settings.IBuildSettings,
                                       code: SourceMap.CodeWithSourceMap ): string {

            // if no sourcemap is needed
            if (! settings.sourceMap ) return code.code

            // path to HandleSourceMap
            const mapPath = filePath.replace(/\.js$/, '.map.js')

            // applying the map
            fs.writeFileSync( mapPath, code.map.toString( ) )

            // so now that we have source map let's map!
            return `${ code.code }\n//# sourceMappingURL=${ mapPath }`
        }

    //
    // ─── GET NEW ADDRESS ────────────────────────────────────────────────────────────
    //

        function GetNewAddress ( settings: Settings.IBuildSettings,
                                 fileName: string ) {
            return fileName
                    .replace( settings.sourceRoot, settings.binRoot )
                    .replace( /\.k$/, '.js' )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}