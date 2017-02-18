
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.CLI.ArgLang {

    //
    // ─── INTERFACE BASE ─────────────────────────────────────────────────────────────
    //

        interface IBase {
            type: 'Literal' | 'Array' | 'Command'
        }

    //
    // ─── VALUE ──────────────────────────────────────────────────────────────────────
    //

        export type TValue = IArray | ILiteral

    //
    // ─── ARRAY ──────────────────────────────────────────────────────────────────────
    //

        export interface IArray extends IBase {
            type:   'Array'
            value:  TValue[ ]
        }

    //
    // ─── COMMAND ────────────────────────────────────────────────────────────────────
    //

        export interface ICommand extends IBase {
            type:   'Command'
            name:   string
            arg:    TValue
        }

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        export interface ILiteral extends IBase {
            type:   'Literal'
            value:  string
        }

    // ────────────────────────────────────────────────────────────────────────────────

}