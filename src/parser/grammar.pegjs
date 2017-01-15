
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// Basic syntax rule object is: { type: string, terminal: boolean, value: any }
//

//
// ─── IDENTIFIERS ────────────────────────────────────────────────────────────────
//

    Identifier
        = inetiferStart:[a-zA-Z] tail:[0-9a-zA-Z\-]* {
            console.log( name );
            return {
                type: 'identifier',
                terminal: true,
                value: inetiferStart + tail.join('')
            }
        }

//
// ─── BOOLEAN ────────────────────────────────────────────────────────────────────
//

    Boolean
        = switches: ( 'on' / 'off' / 'true' / 'false' / 'yes' / 'no' ) {
            let result = true
            switch ( switches ) {
                case 'off':
                case 'false':
                case 'no':
                    result = false
            }
            return {
                type: 'boolean',
                terminal: true,
                value: result
            }
        }

//
// ─── NUMBER ─────────────────────────────────────────────────────────────────────
//

    Numeber
        = digits: [0-9]+(.[0-9]+)? {
            return {
                type: 'number',
                terminal: true,
                value: parseInt( digits.join( '' ), 10 )
            }
        }

// ────────────────────────────────────────────────────────────────────────────────
