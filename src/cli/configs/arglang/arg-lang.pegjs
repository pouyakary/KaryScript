
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── ROOT ───────────────────────────────────────────────────────────────────────
//

    Root =
        _* body:Arguments _* {
            return body
        }
        / '' {
            return {
                type: 'Empty'
            }
        }

//
// ─── ARGUMENTS ──────────────────────────────────────────────────────────────────
//

    Arguments
        = left:Arg _ right:Arguments {
            return [ left ].concat( right )
        }
        / arg:Arg {
            return [ arg ]
        }

//
// ─── SINGLE ARG ─────────────────────────────────────────────────────────────────
//
    
    Arg
        = Command
        / Value
        
    Value
        = Array
        / Literal

//
// ─── COMMAND ────────────────────────────────────────────────────────────────────
//

    Command
        = '--' name:[a-z]+ _ value:Value {
            return {
                type: 	'Command',
                name: 	name.join(''),
                arg: 	value
            }
        }

//
// ─── ARRAY ──────────────────────────────────────────────────────────────────────
//
    
    Array
        = '[' _* body:ArrayBody _* ']' {
            return {
                type: "Array",
                value: body
            }
        }

//
// ─── ARRAY BODY ─────────────────────────────────────────────────────────────────
//

    ArrayBody
        = left:Value _* ',' _* right:ArrayBody {
            return [ left ].concat( right )
        }
        / value:Value {
            return [ value ]
        }

//
// ─── LITERAL ────────────────────────────────────────────────────────────────────
//

    Literal
        = value:[a-zA-Z0-9_\.\-/]+  {
            return {
                type: 	'Literal',
                value: 	value.join('')
            }
        }

//
// ─── WHITESPACE ─────────────────────────────────────────────────────────────────
//

    _
        = " "+

// ────────────────────────────────────────────────────────────────────────────────
