
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── TOOLS ──────────────────────────────────────────────────────────────────────
//

    {
        //
        // ─── GENERATE STRING RESULT ──────────────────────────────────────
        //

            function generateStringResult ( inputs ) {
                function wrapPart ( ) {
                    if ( currentToken.length > 0 )
                        result.push({
                            type: 'StringPart',
                            part: currentToken.join('')
                        })
                }
                let result = [ ]
                let currentToken = [ ]
                for ( let token of inputs ) {
                    if ( typeof token === 'string' ) {
                        currentToken.push( token )
                    } else {
                        wrapPart( )
                        result.push( token )
                        currentToken = [ ]
                    }
                }
                wrapPart( )
                return result
            }

        // ─────────────────────────────────────────────────────────────────
    }

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
        / Empty

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
        / ClassDecleration
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
        = StringLiteral
        / NumericLiteral
        / ReservedValueLiterals
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
        = origin:Returnables FullSpace+ ">" FullSpace+
          target:( Identifier / SExpression / PipeStatement / ReturnKeyword ) {
            return {
                type:       "PipeStatement",
                origin:     origin,
                target:     target,
            }
        }

    ReturnKeyword
        = keyword: ( "return" / "yield" / "throw" ) {
            return {
                type: "ReturnKeyword",
                keyword: keyword
            }
        }

//
// ─── S EXPRESSION ───────────────────────────────────────────────────────────────
//

    SExpression
        = "(" FullSpace* command:( AddressIdentifier / Operator ) FullSpace+
          params:SExpressionArugmentArray? FullSpace* ")" {
        	return {
            	type:       "SExpression",
                kind:       "FunctionCallWithArgs",
                command:    command,
                params:     params,
            }
        }
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
// ─── CLASS DECLERATION ──────────────────────────────────────────────────────────
//

    ClassDecleration
        = "class" WhiteSpcae+ name:Identifier WhiteSpcae* ":" WhiteSpcae* EOL FullSpace*
          body:ClassFunctionDeclerations FullSpace+ "end" {
            return {
                type: 'ClassDecleration',
                name: name.name,
                body: body
            }
        }
        / "class" WhiteSpcae+ name:Identifier WhiteSpcae* ":" WhiteSpcae* Empty "end" {
            return {
                  type: 'ClassDecleration',
                  name: name.name,
                  body: null
              }
        }

    ClassFunctionDeclerations
        = arg:FunctionDecleration FullSpace+ more:ClassFunctionDeclerations {
            return [ arg ].concat( more )
        } 
        / decleration:FunctionDecleration {
            return [ decleration ]
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
        = keyword:ReturnKeyword WhiteSpcae+ expr:Returnables {
            return {
                type:       'ReturnStatement',
                kind:       keyword.kind,
                terminal:   false,
                value:      expr
            }
        }
        / keyword:ReturnKeyword {
            return {
                type:       'ReturnStatement',
                kind:       keyword.kind,
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
                name:       name.name,
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
        = !ReservedWord name:IdentifierName {
            return name
        }

    IdentifierName
        = inetiferStart:[\-a-zA-Z] tail:[0-9a-zA-Z\-]* {
            return {
                type: 'Identifier',
                name: inetiferStart + tail.join('')
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
        
        //
        // ─── KARYSCRIPT KEYWORDS ─────────────────────────────────────────
        //

            = "end"             !IdentifierName
            / "def"             !IdentifierName
            / "unless"          !IdentifierName
            / "and"             !IdentifierName
            / "or"              !IdentifierName
            / "not"             !IdentifierName
            / "ufo"             !IdentifierName
            / "sub"             !IdentifierName
            / "mul"             !IdentifierName
            / "div"             !IdentifierName
            / "sum"             !IdentifierName
            / "exp"             !IdentifierName
            / "eq"              !IdentifierName
            / "greater"         !IdentifierName
            / "less"            !IdentifierName
            / "on"              !IdentifierName
            / "off"             !IdentifierName
            / "true"            !IdentifierName
            / "false"           !IdentifierName
            / "yes"             !IdentifierName
            / "no"              !IdentifierName

        //
        // ─── JAVASCRIPT KEYWORDS ─────────────────────────────────────────
        //

            / "let"             !IdentifierName
            / "var"             !IdentifierName
            / "const"           !IdentifierName
            / "class"           !IdentifierName
            / "function"        !IdentifierName
            / "import"          !IdentifierName
            / "from"            !IdentifierName
            / "for"             !IdentifierName
            / "of"              !IdentifierName
            / "in"              !IdentifierName
            / "while"           !IdentifierName
            / "continie"        !IdentifierName
            / "debugger"        !IdentifierName
            / "delete"          !IdentifierName
            / "do"              !IdentifierName
            / "export"          !IdentifierName
            / "extends"         !IdentifierName
            / "if"              !IdentifierName
            / "else"            !IdentifierName
            / "switch"          !IdentifierName
            / "case"            !IdentifierName
            / "default"         !IdentifierName
            / "try"             !IdentifierName
            / "catch"           !IdentifierName
            / "finally"         !IdentifierName
            / "NaN"             !IdentifierName
            / "null"            !IdentifierName
            / "undefined"       !IdentifierName
            / "typeof"          !IdentifierName
            / "instanceof"      !IdentifierName
            / "new"             !IdentifierName
            / "return"          !IdentifierName
            / "super"           !IdentifierName
            / "throw"           !IdentifierName
            / "void"            !IdentifierName
            / "with"            !IdentifierName
            / "yield"           !IdentifierName

        //
        // ─── FUTURE JAVASCRIPT KEYWORDS ──────────────────────────────────
        //

            / "enum"            !IdentifierName
            / "implements"      !IdentifierName
            / "package"         !IdentifierName
            / "interface"       !IdentifierName
            / "private"         !IdentifierName
            / "protected"       !IdentifierName
            / "public"          !IdentifierName
            / "static"          !IdentifierName
            / "async"           !IdentifierName
            / "await"           !IdentifierName

        //
        // ─── OLDER SPECIFICATION RESERVED WORDS ──────────────────────────
        //

            / "abstract"        !IdentifierName
            / "boolean"         !IdentifierName
            / "byte"            !IdentifierName
            / "char"            !IdentifierName
            / "double"          !IdentifierName
            / "final"           !IdentifierName
            / "float"           !IdentifierName
            / "goto"            !IdentifierName
            / "int"             !IdentifierName
            / "long"            !IdentifierName
            / "native"          !IdentifierName
            / "short"           !IdentifierName
            / "synchronized"    !IdentifierName
            / "throws"          !IdentifierName
            / "transient"       !IdentifierName
            / "volatile"        !IdentifierName

        // ─────────────────────────────────────────────────────────────────

//
// ─── KEYWORDS ───────────────────────────────────────────────────────────────────
//

    Keyword
        = BooleanLiteral


//
// ─── RESERVED VALUE KEYWORDS ────────────────────────────────────────────────────
//

    ReservedValueLiterals
        = value:( "NaN" / "ufo" / "undefined" / "null" / "empty" ) {
            let result
            switch ( value ) {
                case "NaN":
                    result = NaN
                    break
                case "ufo":
                case "undefined":
                    result = undefined
                    break
                case "null":
                case "empty":
                    result = null
            }
            return {
                type:   "ReservedValueLiterals",
                raw:    value,
                value:  result
            }
        }

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
// ─── STRING ─────────────────────────────────────────────────────────────────────
//

    StringLiteral
        = '"' body:( DoubleQuotesStringsParts )* '"' {
            return {
                type:   "StringLiteral",
                key:    '"',
                value:  generateStringResult( body ),
            }
        }
        / "'" body:( SingleQuotesStringsParts )* "'" {
            return {
                type:   "StringLiteral",
                key:    "'",
                value:  generateStringResult( body ),
            }
        }

    DoubleQuotesStringsParts
        = StringInterpolation
        / '\\"'
        / !( '"' / '#' ) char:. {
        	return char
        }

    SingleQuotesStringsParts
        = StringInterpolation
        / "\\'"
        / !( "'" / '#' ) char:. {
        	return char
        }

    StringInterpolation
        = '#' expr:SExpression {
        	return {
                type:   "StringInterpolation",
                expr:   expr
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

    Empty
        = FullSpace* {
            return {
                type: 'Empty'
            }
        }

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
