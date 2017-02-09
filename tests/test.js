//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── TESTS ──────────────────────────────────────────────────────────────────────
//

    const testParser = require('./grammar/index.js')

//
// ─── VARS ───────────────────────────────────────────────────────────────────────
//

    // Error Count
    var ec = 0

//
// ─── RUN TESTS ──────────────────────────────────────────────────────────────────
//

    console.log('\033c')

    ec += testParser( )

//
// ─── DONE ───────────────────────────────────────────────────────────────────────
//

    process.exit( ec )

// ────────────────────────────────────────────────────────────────────────────────
