
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
/// <reference path="../../../../tools/reporter.ts" />

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

            if ( !CheckSimpleUseIdentifierNames( node, env ) ) return ''

            let results = new Array<SourceMap.SourceNode>( )
            for ( const arg of node.args ) {
                const compiledIdentifier = Nodes.CompileSingleNode( arg, env )
                results.push( env.GenerateSourceNode( arg, [
                    'const ', compiledIdentifier, ' = require("', compiledIdentifier, '")'
                ]))
            }

            return env.GenerateSourceNode( node, Join('; ', results ) )
        }

    //
    // ─── CHECK SIMPLE USE IDENTIFIER NAMES ──────────────────────────────────────────
    //

        function CheckSimpleUseIdentifierNames ( node: AST.IUseStatementSimpleImport,
                                                  env: IEnvInfo ) {
            let state = true
            for ( const arg of node.args ) {
                if ( !/^[a-bA-B0-9]+$/.test( arg.name ) ) {
                    state = false
                    Reporter.Report(
                        env,
                        '"' + arg.name + '" cant be used with shortcut use statement.'+
                        ' Names must be simple (only containing [a-bA-B0-9])',
                        arg
                    )
                }
            }
            return state
        }

    // ────────────────────────────────────────────────────────────────────────────────

}