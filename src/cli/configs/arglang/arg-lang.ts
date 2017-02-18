
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

        export interface IBase {
            type: 'Literal' | 'Array' | 'Command' | 'Root' | 'Unkown'
        }

    //
    // ─── ROOT ───────────────────────────────────────────────────────────────────────
    //

        export interface IRoot {
            args: IBase[ ]
        }

    //
    // ─── ARRAY ──────────────────────────────────────────────────────────────────────
    //

        export interface IArray extends IBase {
            value:  IBase[ ]
        }

    //
    // ─── COMMAND ────────────────────────────────────────────────────────────────────
    //

        export interface ICommand extends IBase {
            name:   string
            arg:    IBase | null
        }

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        export interface ILiteral extends IBase {
            value:  string
        }

    //
    // ─── UNKOWN COMMAND ─────────────────────────────────────────────────────────────
    //

        export interface IUnkown extends IBase {
            name:       string
            kind:       'command'
            location:   KaryScript.Compiler.AST.ILocation
        }

    // ────────────────────────────────────────────────────────────────────────────────

}