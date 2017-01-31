
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScriptCompiler {

    //
    // ─── COMPILE FUNCTION ───────────────────────────────────────────────────────────
    //

        /** Gets the parsed AST and compiles it into JavaScript String */
        export function CompileAST ( src: KaryScriptCompiler.Parser.Body ) {


        }

    //
    // ─── BASE COMPILATION SCOPE INFORMATION OBJECT ──────────────────────────────────
    //

        /**
         * The information object that is passed to the __child branches__ for a Body
         * node to have information about it's _parent object_ as well as _environment_
         */
        interface IScopeInformation {
            /** Shows the level of scope depth */
            ScopeLevel: number

            /**
             * Says how much spacing (tabulation) is needed before lines of the
             * code
             */
            IndentationLevel: number

            /**
             * A __Stack of Parent Nodes__ so that you can have a clear view
             * on compilation should happen
             */
            parentNode: Parser.Base[ ]
            
        }

    // ────────────────────────────────────────────────────────────────────────────────

}