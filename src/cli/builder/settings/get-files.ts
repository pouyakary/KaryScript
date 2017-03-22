
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../imports.ts" />

namespace KaryScript.CLI.Builder.Settings {

    //
    // ─── GET FILES ──────────────────────────────────────────────────────────────────
    //

        export function GetAllIncludedFiles ( config: ICLIConfig ): Set<string> {
            let results = new Set<string>( )

            // resolve config ignore files
            const ignoredFiles = GetIgnoreFiles( config )

            // getting plain files
            if ( config.files )
                for ( const file of config.files )
                    if ( !IsDirectoryOrFileIgnored( file, ignoredFiles ) )
                        results.add(
                            path.resolve( config.srcDir, file ) )

            // adding files within the source directory 
            GetDirectoryFiles( ignoredFiles, <string> config.srcDir )
                .forEach( x => results.add( x ) )

            // done
            return results
        }

    //
    // ─── ADD DIRECTORY FILES ────────────────────────────────────────────────────────
    //

        function GetDirectoryFiles ( ignoredFiles: string[ ],
                                              pwd: string,
                                          folder?: string ): string[ ] {
            try {
                // path
                const currentPath = folder? path.join( pwd, folder ) : pwd

                // is this path ignored?
                if ( IsDirectoryOrFileIgnored( currentPath, ignoredFiles ) )
                    return [ ]

                // files / dirs in the current working directory
                const entries = fs.readdirSync( currentPath )

                // result
                let results = new Array<string>( )

                // investigating the dir
                for ( const entry of entries )
                    // going down recursively if it's directory
                    if ( IsDirectory( currentPath, entry ) )
                        results = results.concat(
                            GetDirectoryFiles( ignoredFiles, currentPath, entry ) )

                    // or adding files if they are karyscript formatted
                    else
                        if ( /\.k$/.test( entry ) )
                            results.push( path.join( currentPath, entry ) )

                // done
                return results

            } catch ( e ) {
                return [ ]
            }
        }

    //
    // ─── IS DIRECTORY ───────────────────────────────────────────────────────────────
    //

        function IsDirectory ( pwd: string, entry: string ) {
            return fs.statSync( path.join( pwd, entry ) ).isDirectory( )
        }

    //
    // ─── RESOLVE IGNORES ────────────────────────────────────────────────────────────
    //

        function GetIgnoreFiles ( config: ICLIConfig ) {
            let results = new Array<string>( )

            for ( let file of <string[ ]> config.files )
                results.push(
                    path.resolve( config.srcDir, file ) )

            return results
        }

    //
    // ─── IS DIRECTORY IGNORED ───────────────────────────────────────────────────────
    //

        function IsDirectoryOrFileIgnored ( filePath: string, ignoredFiles: string[ ] ) {
            for ( const ignored of ignoredFiles ) {
                if ( ( new RegExp(`^${ ignored }`) ).test( filePath ) )
                    return true

                if ( /\/\.git\//.test( filePath ) )
                    return true
            }

            return false
        }

    // ────────────────────────────────────────────────────────────────────────────────

}