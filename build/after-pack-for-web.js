
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    const   fs          = require('fs')
    const   path        = require('path')

//
// ─── ADDING INFO ────────────────────────────────────────────────────────────────
//

    const   regex       = /\/\/# sourceMappingURL\=karyscript\-core\.js\.map(?:\s)*\/\*\*\*\/ \}\)\n\/\*\*\*\*\*\*\/ \]\);(?:\s)*$/
    const   replacement = '\n window.KaryScript = KaryScript;\n }) ]);'

//
// ─── BIN FILE ───────────────────────────────────────────────────────────────────
//

    const   binPath     = path.resolve( __dirname, '../bin/karyscript.js' )
    let     binFile     = fs.readFileSync( binPath, 'utf8' )

//
// ─── APPLY HEADER ───────────────────────────────────────────────────────────────
//

    binFile = binFile.replace( regex, replacement )

//
// ─── SAVE BIN FILE ──────────────────────────────────────────────────────────────
//

    fs.writeFileSync( binPath, binFile )

// ────────────────────────────────────────────────────────────────────────────────
