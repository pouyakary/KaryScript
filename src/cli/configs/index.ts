
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="baseconfig.ts" />
/// <reference path="file-configs.ts" />
/// <reference path="cli-configs.ts" />

namespace KaryScript.CLI {

    //
    // ─── GET CONFIGS ────────────────────────────────────────────────────────────────
    //

        export function GetConfigs ( ) {
            let config: ICLIConfig

            // loading the config file
            config = CLI.LoadConfigurationsFromConfigFile( )

            // loading configs from command line and assigning them to the configs
            Object.assign( config, 
                CLI.LoadConfigurationsFromCLIArgs( ) )

            return config
        }

    // ────────────────────────────────────────────────────────────────────────────────

}