
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

    Root = Body

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    Body
        = statements:( SpacedStatements )+ {
        	return {
            	type: 'Body',
                children: statements
            }
        }

//
// ─── SPACES STATEMENTS ──────────────────────────────────────────────────────────
//

    SpacedStatements
        = FullSpace* statement: Statement FullSpace* {
            return statement
        }

//
// ─── STATEMENTS ─────────────────────────────────────────────────────────────────
//

    Statement
        = DeclerationStatement
        / ReturnStatement
        / PipeStatement
        / SExpression
        / Expression

//
// ─── SINGLE EXPRESSION ─────────────────────────────────────────────────────────
//

    Expression
        = Literals
        / Identifier
        / Assignment
        / SExpression

//
// ─── LITERALS ───────────────────────────────────────────────────────────────────
//

    Literals
        = NumericLiteral
        / BooleanLiteral

//
// ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
//

    PipeStatement
        = origin:Expression FullSpace+ ">" FullSpace+ target: ( Identifier / SExpression / PipeStatement ) {
            return {
                type:"PipeStatement",
                origin: origin,
                target: target
            }
        }

//
// ─── S EXPRESSION ───────────────────────────────────────────────────────────────
//

    SExpression
        = "[" FullSpace* name:Identifier FullSpace+ params:SExpressionArugmentArray?  FullSpace* "]" {
        	return {
            	type:"SExpression",
                name: name,
                terminal: false,
                params: params
            }
        }
        / "[" FullSpace* name:Identifier FullSpace* "]" {
        	return {
            	type:"SExpression",
                name: name,
                terminal: true,
            }
        }
    

    SExpressionArugmentArray
       = arg:Expression FullSpace+ more:SExpressionArugmentArray {
          return [ arg ].concat( more )
       } 
       / subArg:Expression {
       	  return [ subArg ]
       }

//
// ─── DEFINE STATEMENT ───────────────────────────────────────────────────────────
//

    DeclerationStatement
        = type:( "const" /  "let" / "var" ) WhiteSpcae+  assignment:Assignment {
            return {
                type: 'DeclerationStatement',
                type: type,
                assignment: assignment
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
        / "return" {
            return {
                type: 'ReturnStatement',
                terminal: true
            }
        }

//
// ─── ASSIGN STATEMENT ───────────────────────────────────────────────────────────
//

    Assignment
        = name:Identifier WhiteSpcae* "=" WhiteSpcae* value:Expression {
            return {
                type: 'Assignment',
                name: name,
                value: value
            }
        }

//
// ─── IDENTIFIERS ────────────────────────────────────────────────────────────────
//

    Identifier
        = !ReservedWord inetiferStart:[_a-zA-Z] tail:[0-9a-zA-Z\-]* {
            return {
                type: 'Identifier',
                name: inetiferStart + tail.join('')
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
                value: parseInt( digits.join( '' ), 10 )
            }
        }

//
// ─── FULL SPACE ─────────────────────────────────────────────────────────────────
//

    FullSpace
        = EOL
        / WhiteSpcae

//
// ─── WHITESPACE ─────────────────────────────────────────────────────────────────
//

    WhiteSpcae
        = spaces: ( "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF" / SeperatorSpaces ) {
            return {
                type: 'WhiteSpcae',
                value: spaces
            }
        }

    EOL
        = WhiteSpcae* LineTerminator {
            return {
                type: 'LineTerminator',
                value: '\n',
            }
        }

    LineTerminator
        = [\n\r\u2028\u2029] {
            return {
                type: 'LineTerminator',
                value: '\n',
            }
        }

    LineTerminatorSequence
        = ( "\n"  / "\r\n" / "\r" / "\u2028" / "\u2029" ) {
            return {
                type: 'LineTerminatorSequence',
                raw: '\n',
            }
        }

    SeperatorSpaces = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

// ────────────────────────────────────────────────────────────────────────────────
