
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../imports.ts" />
/// <reference path="get-files.ts" />

namespace KaryScript.CLI.Builder.Settings {

    //
    // ─── BUILD SETTINGS ─────────────────────────────────────────────────────────────
    //

        export interface IBuildSettings {
            sourceRoot:     string
            binRoot:        string
            files:          Set<string>
            sourceMap:      boolean
        }

    //
    // ─── GET BUILD SETTINGS ─────────────────────────────────────────────────────────
    //

        export function GetBuildSettings ( configs: ICLIConfig ): IBuildSettings {
            // included files
            const includedFiles = Settings.GetAllIncludedFiles( configs )

            // base setting
            let settings: IBuildSettings = {
                sourceRoot:     <string> configs.srcDir,
                binRoot:        <string> configs.outDir,
                files:          includedFiles,
                sourceMap:      configs.sourceMap || false
            }

            // done
            return settings
        }

    // ────────────────────────────────────────────────────────────────────────────────

}