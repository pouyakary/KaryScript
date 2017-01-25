
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
        = statements:SpacedStatements+ {
        	return {
            	type: 'Body',
                children: statements
            }
        }
        / FullSpace* {
            return {
                type: 'Empty'
            }
        }

//
// ─── SPACES STATEMENTS ──────────────────────────────────────────────────────────
//

    SpacedStatements
        = FullSpace* statement:Statement FullSpace* {
            return statement
        }

//
// ─── STATEMENTS ─────────────────────────────────────────────────────────────────
//

    Statement
        = FunctionDecleration
        / DeclerationStatement
        / ReturnStatement
        / PipeStatement
        / SExpression

//
// ─── RETURNABLES ────────────────────────────────────────────────────────────────
//

    Returnables
        = Assignment
        / Expression

//
// ─── SINGLE EXPRESSION ─────────────────────────────────────────────────────────
//

    Expression
        = Literals
        / Identifier
        / LambdaExpression
        / SExpression

//
// ─── LITERALS ───────────────────────────────────────────────────────────────────
//

    Literals
        = NumericLiteral
        / BooleanLiteral

//
// ─── LAMBDA EXPRESSIONS ─────────────────────────────────────────────────────────
//

    LambdaExpression
        = "[" FullSpace* args:IdentifierList FullSpace* "=>"
          FullSpace* code:Body FullSpace* "]" {
            return {
                type: "LambdaExpression",
                args: args.map( x => x.name ),
                code: code
            }
        }

//
// ─── IDENTIFER LIST ─────────────────────────────────────────────────────────────
//

    IdentifierList
       = arg:Identifier FullSpace+ more:IdentifierList {
          return [ arg ].concat( more )
       }
       / subArg:Expression {
       	  return [ subArg ]
       }

//
// ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
//

    PipeStatement
        = origin:Returnables FullSpace+ ">" FullSpace+ target:( Identifier / SExpression / PipeStatement ) {
            return {
                type:       "PipeStatement",
                origin:     origin,
                target:     target,
            }
        }

//
// ─── S EXPRESSION ───────────────────────────────────────────────────────────────
//

    SExpression
        // (function-name arg1 arg2 ...)
        = "(" FullSpace* command:( AddressIdentifier / Operator ) FullSpace+
          params:SExpressionArugmentArray? FullSpace* ")" {
        	return {
            	type:       "SExpression",
                kind:       "FunctionCallWithArgs",
                command:    command,
                params:     params,
            }
        }
        /*
        // binary operators (arg1 + arg2)
        / "(" FullSpace* left:Expression FullSpace+ operator:Operator FullSpace+
          right:Expression FullSpace* ")" {
            return {
                type:       "SExpression",
                kind:       "BinaryOperator",
                operator:   operator,
                left:       left,
                right:      right
            }
        }*/
        // only function call with no argument (function-name)
        / "(" FullSpace* command:AddressIdentifier FullSpace* ")" {
        	return {
            	type:       "SExpression",
                kind:       "FunctionCallOnly",
                command:    command
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
// ─── FUNCTION DECLERATION ───────────────────────────────────────────────────────
//

    FunctionDecleration
        = "def" WhiteSpcae+ name:Identifier WhiteSpcae* args:IdentifierList
          WhiteSpcae* ":" FullSpace* code:Body "end" {
            return {
                type: "FunctionDecleration",
                name: name.name,
                args: args.map( x => x.name ),
                code: code
            }
        }
        / "def" WhiteSpcae+ name:Identifier WhiteSpcae* ":" FullSpace* code:Body "end" {
            return {
                type: "FunctionDecleration",
                name: name.name,
                args: null,
                code: code
            }
        }

//
// ─── DEFINE STATEMENT ───────────────────────────────────────────────────────────
//

    DeclerationStatement
        = modifier:( "const" /  "def" ) WhiteSpcae+ assignment:Assignment {
            return {
                type: 'DeclerationStatement',
                modifier: modifier,
                assignment: assignment
            }
        }

//
// ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
//

    ReturnStatement
        = "return" WhiteSpcae+ expr:Returnables {
            return {
                type:       'ReturnStatement',
                terminal:   false,
                value:      expr
            }
        }
        / "return" {
            return {
                type:       'ReturnStatement',
                terminal:   true
            }
        }

//
// ─── ASSIGN STATEMENT ───────────────────────────────────────────────────────────
//

    Assignment
        = name:AddressIdentifier WhiteSpcae* "=" WhiteSpcae* value:Expression {
            return {
                type:       'Assignment',
                name:       name,
                value:      value
            }
        }

//
// ─── ADDRESS IDENTIFIER ─────────────────────────────────────────────────────────
//

    AddressIdentifier
        = space:Identifier "/" member:( AddressIdentifier / Identifier ) {
            return {
                type: "AddressIdentifier",
                address: ( member.type === "Identifier" )?
                    [ space.name, member.name ] : [ space.name ].concat( member.address )
            }
        }
        / Identifier

//
// ─── IDENTIFIERS ────────────────────────────────────────────────────────────────
//

    Identifier
        = !ReservedWord inetiferStart:[\-a-zA-Z] tail:[0-9a-zA-Z\-]* {
            var raw = inetiferStart + tail.join('')
            return {
                type: 'Identifier',
                raw: raw,
                name: raw.replace( /-/g, '_' )
            }
        }

//
// ─── BINARY OPERATORS ───────────────────────────────────────────────────────────
//

    Operator
        = op:( '/' / '+' / '-' / '*' / '^' / '%' / 'and' / 'or' ) {
            return {
                type: 'Operator',
                operator: op
            }
        }

//
// ─── RESERVED WORDS ─────────────────────────────────────────────────────────────
//

    ReservedWord
        = Keyword
        / "end"
        / "def" / "const"
        / "import" / "from"
        / "for" / "of" / "in"
        / "while"
        / "if"
        / "try" / "catch"
        / 'and' / 'or'
        / "NaN"

//
// ─── KEYWORDS ───────────────────────────────────────────────────────────────────
//

    Keyword
        = BooleanLiteral

//
// ─── BOOLEAN ────────────────────────────────────────────────────────────────────
//

    BooleanLiteral
        = key:( 'on' / 'off' / 'true' / 'false' / 'yes' / 'no' ) {
            let result = true
            switch ( key ) {
                case 'off':
                case 'false':
                case 'no':
                    result = false
            }
            return {
                type: 'BooleanLiteral',
                key: key,
                value: result
            }
        }

//
// ─── NUMBER ─────────────────────────────────────────────────────────────────────
//

    NumericLiteral
        = "Nan" {
            return {
                type:   'NumericLiteral',
                raw:    "NaN",
                value:  NaN
            }
        }
        / sign:'-'? '0x' numerics:[0-9a-f]+ {
        	let number = ( sign? sign : '' ) + '0x' + numerics.join('')
            return {
                type:   'NumericLiteral',
                raw:    number,
                value:  eval( number )
            }
        }
        / sign:'-'? start:[0-9]+ decimals:('.'[0-9]+)? {
        	let number = (
               ( sign? sign : '' ) + 
               ( parseInt( start.join('') ) ).toString( ) +
               ( decimals? '.' + decimals[ 1 ].join('') : '' )
            )
            return {
                type:   'NumericLiteral',
                raw:    number,
                value:  decimals? parseFloat( number ) : parseInt( number )
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
        = spaces:( "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF" / SeperatorSpaces ) {
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
