
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

/// <reference path="../../../switcher.ts" />
/// <reference path="../../../../tools/concat.ts" />

namespace KaryScript.Compiler.Nodes.Use {

    //
    // ─── COMPILER ───────────────────────────────────────────────────────────────────
    //

        export function Compile ( node: AST.IUseStatement, env: IEnvInfo ) {
            switch ( node.kind ) {
                case 'simple':
                    return CompileSimpleUse( node as AST.IUseStatementSimpleImport, env )
            }
            return ''
        }

    //
    // ─── SIMPLE USE IMPORT ──────────────────────────────────────────────────────────
    //

        function CompileSimpleUse ( node: AST.IUseStatementSimpleImport,
                                     env: IEnvInfo ) {
            let results = new Array<SourceMap.SourceNode>( )
            for ( const arg of node.args ) {
                const compiledIdentifier = Nodes.CompileSingleNode( arg, env )
                results.push( env.GenerateSourceNode( arg, [
                    'const ', compiledIdentifier, ' = require("', compiledIdentifier, '")'
                ]))
            }
            return env.GenerateSourceNode( node, Join('; ', results ) )
        }

    // ────────────────────────────────────────────────────────────────────────────────

}