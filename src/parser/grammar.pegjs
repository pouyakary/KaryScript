
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// Basic syntax rule object is: { 
//    type: string, // what is the that we have
//    terminal: boolean, // is terminal or contains children
//    value: any, // what parser needs
//    raw: string // exact matching (for formatters)
//    children?: this[ ] // if it contained any child
// }
//

//
// ─── ROOT ───────────────────────────────────────────────────────────────────────
//

    Root = Body

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    Body
        = statements:( SpacedStatements )+ {
        	return {
            	type: 'Body',
                terminal: false,
                value: statements
            }
        }

//
// ─── SPACES STATEMENTS ──────────────────────────────────────────────────────────
//

    SpacedStatements
        = ( WhiteSpcae | EOL )* statement: Statement ( WhiteSpcae | EOL )* {
            return statement
        }

//
// ─── STATEMENTS ─────────────────────────────────────────────────────────────────
//

    Statement
        = DeclerationStatement
        / ReturnStatement
        / Expression

//
// ─── SINGLE EXPRESSION ─────────────────────────────────────────────────────────
//

    Expression
        = Literals
        / Identifier
        / Assignment

//
// ─── LITERALS ───────────────────────────────────────────────────────────────────
//

    Literals
        = NumericLiteral
        / BooleanLiteral

//
// ─── DEFINE STATEMENT ───────────────────────────────────────────────────────────
//

    DeclerationStatement
        = type:( "const" /  "let" / "var" ) WhiteSpcae+  assignment:Assignment {
            return {
                type: 'DeclerationStatement',
                terminal: false,
                value: {
                    type: type,
                    assignment: assignment
                }
            }
        }

//
// ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
//

    ReturnStatement
        = "return" WhiteSpcae+ expr:Expression {
            return {
                type: 'ReturnStatement',
                terminal: false,
                value: expr
            }
        }

//
// ─── ASSIGN STATEMENT ───────────────────────────────────────────────────────────
//

    Assignment
        = name:Identifier WhiteSpcae* "=" WhiteSpcae* value:Expression {
            return {
                type: 'Assignment',
                terminal: false,
                value: {
                    name: name,
                    value: value
                }
            }
        }

//
// ─── IDENTIFIERS ────────────────────────────────────────────────────────────────
//

    Identifier
        = !ReservedWord inetiferStart:[_a-zA-Z] tail:[0-9a-zA-Z\-]* {
            return {
                type: 'Identifier',
                terminal: true,
                value: inetiferStart + tail.join('')
            }
        }

//
// ─── RESERVED WORDS ─────────────────────────────────────────────────────────────
//

    ReservedWord
        = Keyword

//
// ─── KEYWORDS ───────────────────────────────────────────────────────────────────
//

    Keyword
        = BooleanLiteral

//
// ─── BOOLEAN ────────────────────────────────────────────────────────────────────
//

    BooleanLiteral
        = switches: ( 'on' / 'off' / 'true' / 'false' / 'yes' / 'no' ) {
            let result = true
            switch ( switches ) {
                case 'off':
                case 'false':
                case 'no':
                    result = false
            }
            return {
                type: 'BooleanLiteral',
                terminal: true,
                value: result
            }
        }

//
// ─── NUMBER ─────────────────────────────────────────────────────────────────────
//

    NumericLiteral
        = digits: ( '-'? [0-9]+ ( . [0-9]+ ) ? ) {
            return {
                type: 'NumericLiteral',
                terminal: true,
                value: parseInt( digits.join( '' ), 10 )
            }
        }

//
// ─── WHITESPACE ─────────────────────────────────────────────────────────────────
//

    WhiteSpcae
        = spaces: ( "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF" / SeperatorSpaces ) {
            return {
                type: 'WhiteSpcae',
                terminal: true,
                value: spaces
            }
        }

    EOL
        = WhiteSpcae* LineTerminator {
            return {
                type: 'LineTerminator',
                value: '\n',
                terminal: true
            }
        }

    LineTerminator
        = [\n\r\u2028\u2029] {
            return {
                type: 'LineTerminator',
                value: '\n',
                terminal: true
            }
        }

    LineTerminatorSequence
        = ( "\n"  / "\r\n" / "\r" / "\u2028" / "\u2029" ) {
            return {
                type: 'LineTerminatorSequence',
                raw: '\n',
                terminal: true
            }
        }

    SeperatorSpaces = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

// ────────────────────────────────────────────────────────────────────────────────
