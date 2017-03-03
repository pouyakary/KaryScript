
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler {

    //
    // ─── BASE COMPILATION SCOPE INFORMATION OBJECT ──────────────────────────────────
    //

        /**
         * The information object that is passed to the __child branches__ for a Body
         * node to have information about it's _parent object_ as well as _environment_
         */
        export interface IEnv {
            /** Shows the level of scope depth */
            ScopeLevel: number

            /**
             * Available Holders
             */
            Holders: Map<string, CompiledCode>

            /**
             * A __Stack of Parent Nodes__ so that you can have a clear view
             * on compilation should happen
             */
            ParentNode: AST.IBase[ ]

            /**
             * Defined Identifiers. Keeps a stack of defined identifiers within scopes
             */
            DeclaredIdentifiers: Set<String>

            /**
             * Errors
             */
            Errors: Set<Reporter.CompilerError>

            /**
             * Formatting defs
             */
            Format: Formatter

            /**
             * Zone Stack
             */
            ZoneStack: string[ ]

            /**
             * Zone
             */
            ZoneIdentifiers: ZoneIdentifiers

            /**
             * SourceMap Generator
             */
            GenerateSourceNode: ( node: AST.IBase,
                                 chunk: Array<CompiledCode> | CompiledCode,
                                 name?: string ) => SourceMap.SourceNode

            PushZoneIdentifier: ( env: IEnv, name: AST.IIdentifier ) => void

            GetZoneId: ( env: IEnv ) => string | null
        }

    //
    // ─── ZONE IDENTIFIERS ───────────────────────────────────────────────────────────
    //

        export interface ZoneIdentifiers {
            [ zoneId: string ]: IZoneInfoContainer
        }

        export interface IZoneInfoContainer {
            zoneId:             string
            parentZoneId:       string | null
            zoneIdentifiers:    string[ ]
        }

    //
    // ─── FORMATTER ──────────────────────────────────────────────────────────────────
    //

        export interface Formatter {
            PrintComments: boolean
        }

    // ────────────────────────────────────────────────────────────────────────────────

}