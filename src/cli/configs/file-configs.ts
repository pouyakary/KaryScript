
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../imports.ts" />
/// <reference path="baseconfig.ts" />

namespace KaryScript.CLI {

    //
    // ─── LOAD CONFIGURATIONS ────────────────────────────────────────────────────────
    //

        export function LoadConfigurationsFromConfigFile ( ): ICLIConfig {
            // defs
            const userConfig    = LookForConfigurationFile( )
            let   resultConfig  = Object.assign({ }, BaseConfigObject )
        
            // out dir
            if ( userConfig.outDir )
                resultConfig.outDir = path.resolve(
                    path.join( process.cwd( ), userConfig.outDir ) )

            // source dir
            if ( userConfig.srcDir )
                resultConfig.srcDir = path.resolve(
                    path.join( process.cwd( ), userConfig.srcDir ) )

            // sourceMap
            if ( userConfig.sourceMap !== undefined )
                resultConfig.sourceMap = userConfig.sourceMap

            return resultConfig
        }

    //
    // ─── LOOK FOR CONFIGURATION FILE ────────────────────────────────────────────────
    //

        function LookForConfigurationFile ( ) {
            const pathToConfig = path.join( process.cwd( ), 'k.yml' )
            try {
                const file = fs.readFileSync( pathToConfig, 'utf8' )
                return <ICLIConfig> yaml.load( file )

            } catch ( e ) {
                return <ICLIConfig> { }
            }
        }

    // ────────────────────────────────────────────────────────────────────────────────

}