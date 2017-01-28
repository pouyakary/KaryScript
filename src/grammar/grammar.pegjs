
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
                    if ( currentToken.length > 0 ) {
                        result.push({
                            type: 'StringPart',
                            part: currentToken.join('')
                        })
                    }
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
        = __* statement:Statement ( __+ / _* EOL / EOF ) {
            return statement
        }

//
// ─── STATEMENTS ─────────────────────────────────────────────────────────────────
//

    Statement
        = FunctionDeceleration
        / ClassDeceleration
        / DecelerationStatement
        / ObjectDeceleration
        / SingleAssignmentStatement
        / ArrayDeceleration
        / IfStatement
        / WhileStatement
        / ReturnStatement
        / PipeStatement
        / SExpression
        / AwaitStatement

//
// ─── RETURNABLES ────────────────────────────────────────────────────────────────
//

    Returnables
        = DecelerationAssignment
        / SExpressionBody
        / AwaitStatement
        / Expression

//
// ─── SINGLE EXPRESSION ─────────────────────────────────────────────────────────
//

    Expression
        = Literals
        / Identifier
        / ArrayObjectIndexLoader
        / LambdaExpression
        / SExpression

//
// ─── LITERALS ───────────────────────────────────────────────────────────────────
//

    Literals
        = ObjectLiteral
        / ArrayLiteral
        / StringLiteral
        / NumericLiteral
        / ReservedValueLiterals
        / BooleanLiteral

//
// ─── CONDITIONABLE ──────────────────────────────────────────────────────────────
//

    ConditionalsPredicate
        = __+ predicate:Predicate __* ":" __* {
            return predicate
        }

    Predicate
        = SExpressionBody
        / BooleanLiteral
        / Expression

//
// ─── IF STATEMENT ───────────────────────────────────────────────────────────────
//

    IfStatement
        = key:IfSwitchKey predicate:ConditionalsPredicate body:Body END {
              return {
                  type: "IfStatement",
                  key: key,
                  kind: "if",
                  predicate: predicate,
                  trueBranch: body
              }
          }
        / key:IfSwitchKey predicate:ConditionalsPredicate trueBranch:Body __
          elseIfBranches: ElseIfStatementArray __ "else" __ falseBranch:Body END {
              return {
                  type: "IfStatement",
                  key: key,
                  kind: "if-else",
                  predicate: predicate,
                  trueBranch: trueBranch,
                  elseIfBranches: elseIfBranches,
                  falseBranch: falseBranch
              }
          }
        / key:IfSwitchKey predicate:ConditionalsPredicate trueBranch:Body "else" __
          falseBranch:Body END {
              return {
                  type: "IfStatement",
                  key: key,
                  kind: "if-elseif-else",
                  predicate: predicate,
                  trueBranch: trueBranch,
                  falseBranch: falseBranch
              }
          }

    IfSwitchKey
        = key:( "if" / "unless" ) {
            return key
        }

    ElseIfStatementArray
        = elesIfClouse:ElseIfStatement __ more:ElseIfStatementArray {
            return [ elesIfClouse ].concat( more )
        } 
        / elesIfClouse:ElseIfStatement {
            return [ elesIfClouse ]
        }

    ElseIfStatement
        = "elsif" _+ predicate:ConditionalsPredicate body:Body EOL {
            return {
                type:       "ElseIfStatement",
                predicate:  predicate,
                body:       body
            }
        }
          
//
// ─── WHILE STATEMENT ────────────────────────────────────────────────────────────
//

    WhileStatement
        = "while" predicate:ConditionalsPredicate
          body:Body END {
              return {
                  type: "WhileStatement",
                  predicate: predicate,
                  body: body
              }
        }

//
// ─── LAMBDA EXPRESSIONS ─────────────────────────────────────────────────────────
//

    LambdaExpression
        = "[" __* args:IdentifierList __* "=>" __* code:Body __* "]" {
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
        = arg:Identifier __+ more:IdentifierList {
            return [ arg ].concat( more )
        }
        / subArg:Expression {
            return [ subArg ]
        }

//
// ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
//

    PipeStatement
        = origin:Returnables PipeControl parts:PipeStatementParts {
            return {
                type:  "PipeStatement",
                levels: [ origin ].concat( parts )
            }
        }

    PipeStatementParts
        = origin:Returnables PipeControl more:PipeStatementParts {
            return [ origin ].concat( more )
        }
        / terminal:( Identifier / SExpression / ReturnKeyword ) {
            return [ terminal ]
        }

    PipeControl
        = __* '>' __*
        / __+ 'then' __+

//
// ─── RETURN KEYWORD ─────────────────────────────────────────────────────────────
//

    ReturnKeyword
        = keyword: ( "return" / "yield" / "throw" ) {
            return {
                type: "ReturnKeyword",
                keyword: keyword
            }
        }

//
// ─── AWAIT STATEMENT ────────────────────────────────────────────────────────────
//

    AwaitStatement
        = "await" _+ expr:( SExpression / SExpressionBody ) {
            return {
                type: "AwaitStatement",
                expr: expr
            }
        }    

//
// ─── S EXPRESSION ───────────────────────────────────────────────────────────────
//

    SExpression
        = "(" __* body:SExpressionBody __* ")" {
            return body
        }

    SExpressionBody
        = command:SExpressionCommands __+ params:SExpressionArugmentArray? {
            return {
                type:       "SExpression",
                kind:       "FunctionCallWithArgs",
                command:    command,
                params:     params,
            }
        }
        / operator:BinaryOperator __+ left:Expression __+ right:Expression {
            return {
                type:       "SExpression",
                kind:       "BinaryOperator",       
                operator:   operator,
                left:       left,
                right:      right 
            }
        }
        / operator:UnaryOperator __+ arg:Expression {
            return {
                type:       "SExpression",
                kind:       "UnaryOperator",       
                operator:   operator,
                arg:        arg
            }
        }
        / command:SExpressionCommands {
            return {
                type:       "SExpression",
                kind:       "FunctionCallOnly",
                command:    command
            }
        }
    
    SExpressionArugmentArray
        = arg:SExpressionArugment __+ more:SExpressionArugmentArray {
            return [ arg ].concat( more )
        } 
        / subArg:SExpressionArugment {
            return [ subArg ]
        }

    SExpressionArugment
        = PipePlaceholder
        / Expression

    SExpressionCommands
        = AddressIdentifier
        / command: ( 'cat' / 'print' ) {
            return {
                type:    "SpecialCommand",
                command: command
            }
        }

//
// ─── CLASS DECLERATION ──────────────────────────────────────────────────────────
//

    ClassDeceleration
        = "class" _+ name:Identifier _* ":" _* EOL __*
        body:ClassFunctionDecelerations END {
            return {
                type: 'ClassDeceleration',
                name: name.name,
                body: body
            }
        }
        / "class" _+ name:Identifier _* ":" _* Empty END {
            return {
                type: 'ClassDeceleration',
                name: name.name,
                body: null
            }
        }

    ClassFunctionDecelerations
        = arg:FunctionDeceleration __+ more:ClassFunctionDecelerations {
            return [ arg ].concat( more )
        } 
        / decleration:FunctionDeceleration {
            return [ decleration ]
        }

//
// ─── FUNCTION DECLERATION ───────────────────────────────────────────────────────
//

    FunctionDeceleration
        = key:FunctionDefKind _+ name:Identifier _* args:IdentifierList
        _* ":" __* code:Body END {
            return {
                type: "FunctionDeceleration",
                name: name.name,
                key:  key,
                args: args.map( x => x.name ),
                code: code
            }
        }
        / key:FunctionDefKind _+ name:Identifier _* ":" __* code:Body END {
            return {
                type: "FunctionDeceleration",
                name: name.name,
                key:  key,
                args: null,
                code: code
            }
        }

    FunctionDefKind
        = type:( 'def' / 'async' ) {
            return type
        }

//
// ─── DEFINE STATEMENT ───────────────────────────────────────────────────────────
//

    DecelerationStatement
        = modifier:( "const" / "def" ) _+ assignment:DecelerationAssignment {
            return {
                type: 'DecelerationStatement',
                kind: 'SingleAllocInit',
                modifier: modifier,
                assignment: assignment
            }
        }
        / "def" _+ names:NameOnlyDecelerationsArray _* ( EOL / EOF ) {
            return {
                type: 'DecelerationStatement',
                kind: 'MultiAlloc',
                names: names.map( x => x.name )
            }
        }

    NameOnlyDecelerationsArray
        = name:Identifier _+ more:NameOnlyDecelerationsArray {
            return [ name ].concat( more )
        } 
        / name:Identifier {
            return [ name ]
        }

//
// ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
//

    ReturnStatement
        = keyword:ReturnKeyword _+ expr:Returnables {
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

    DecelerationAssignment
        = name:Identifier _* "=" _* value:Returnables {
            return {
                type:  'DecelerationAssignment',
                name:  name.name,
                value: value
            }
        }

//
// ─── SINGLE ASSIGNMENT ──────────────────────────────────────────────────────────
//

    SingleAssignmentStatement
        = name:AddressIdentifier _* "=" _* value:Returnables {
            return {
                type:  'DecelerationAssignment',
                name:  name,
                value: value
            }
        }

//
// ─── ADDRESS IDENTIFIER ─────────────────────────────────────────────────────────
//

    AddressIdentifier
        = space:Identifier "." member:( AddressIdentifier / Identifier ) {
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

    BinaryOperator
        = op:( 'div' / 'sub' / 'sum' / 'mul' / 'pow' / 'rem' / 'and' / 'or' / 
            'eq' / 'bigger' / 'lower' ) {
            return {
                type:       'BinaryOperator',
                operator:   op
            }
        }

//
// ─── UNARAY OPERATORS ───────────────────────────────────────────────────────────
//

    UnaryOperator
        = operator:( "not" / "async" / "await" / "new" / "delete" / "typeof" / "void" ) {
            return {
                type:       "UnaryOperator",
                operator:   operator
            }
        }

//
// ─── INDEX LOADER ───────────────────────────────────────────────────────────────
//

    ArrayObjectIndexLoader
        = "[" __* name:AddressIdentifier __* "|" __* index:Returnables __* "]" {
            return {
                type:   "ArrayObjectIndexLoader",
                name:   name,
                index:  index
            }
        }

//
// ─── OBJECT LITERALS ────────────────────────────────────────────────────────────
//

    ObjectLiteral
        = "[" __* ":" __* "]" {
            return {
                type:   "ObjectLiteral",
                value:  [ ]
            }
        }
        / "[" __* members:ObjectPairMember __* "]" {
            return {
                type:   "ObjectLiteral",
                value:  members
            }
        }
      
    ObjectDeceleration
        = "object" __* name:Identifier __* ":" __* members:ObjectPairMember __+ END {
            return {
                type:   "ObjectDeceleration",
                name:   name.name,
                value:  members
            }
        }

    ObjectPairMember
        = member:ObjectAssignment _* ( EOL / "," ) _*
          more:ObjectPairMember {
            return [ member ].concat( more )
        } 
        / member:ObjectAssignment {
            return [ member ]
        }

    ObjectAssignment
        = name:Identifier _* ":" _* value:Returnables {
            return {
                key:        name.name,
                value:      value
            }
        }

//
// ─── ARRAY LITERALS ─────────────────────────────────────────────────────────────
//

    ArrayLiteral
        = "[" __* "]" {
            return {
                type:   "ArrayLiteral",
                value:  [ ]
            }
        }
        / "[" __* members:ArrayMember __* "]" {
            return {
                type:   "ArrayLiteral",
                value:  members
            }
        }

    ArrayDeceleration
        = "array" _+ name:Identifier __* ":"  __* members:ArrayMember __+ END {
            return {
                type:   "ArrayDeceleration",
                name:   name.name,
                value:  members
            }
        }

    ArrayMember
        = member:Expression __+ more:ArrayMember {
            return [ member ].concat( more )
        } 
        / member:Expression {
            return [ member ]
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
            / "pow"             !IdentifierName
            / "rem"             !IdentifierName
            / "eq"              !IdentifierName
            / "bigger"          !IdentifierName
            / "lower"           !IdentifierName
            / "on"              !IdentifierName
            / "off"             !IdentifierName
            / "true"            !IdentifierName
            / "false"           !IdentifierName
            / "yes"             !IdentifierName
            / "no"              !IdentifierName
            / "cat"             !IdentifierName
            / "print"           !IdentifierName
            / "nan"             !IdentifierName

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
        = value:( "nan" / "NaN" / "ufo" / "undefined" / "null" / "empty" ) {
            let result
            switch ( value ) {
                case "NaN":
                case "nan":
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
        = sign:'-'? '0x' numerics:[0-9a-f]+ {
            let number = ( sign? sign : '' ) + '0x' + numerics.join('')
            return {
                type:   'NumericLiteral',
                raw:    number,
                value:  eval( number )
            }
        }
        / sign:'-'? start:[0-9]+ decimals:('.'[0-9]+)? {
            let number = (
                ( sign? sign : '' ) + start.join('') +
                ( decimals? '.' + decimals[ 1 ].join('') : '' )
            )
            return {
                type:   'NumericLiteral',
                raw:    number,
                value:  decimals? parseFloat( number ) : parseInt( number )
            }
        }

//
// ─── PIPE HOLDER ────────────────────────────────────────────────────────────────
//

    PipePlaceholder = "@" {
        return {
            type: "PipePlaceholder"
        }
    }

//
// ─── END KEYWORD ────────────────────────────────────────────────────────────────
//

    END = "end"

//
// ─── FULL SPACE ─────────────────────────────────────────────────────────────────
//

    __
        = EOL
        / _

//
// ─── WHITESPACE ─────────────────────────────────────────────────────────────────
//

    Empty
        = __* {
            return {
                type: 'Empty'
            }
        }

    _
        = spaces:( "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF" / SeperatorSpaces ) {
            return {
                type: '_',
                value: spaces
            }
        }

    EOL
        = _* LineTerminator {
            return {
                type: 'LineTerminator',
                value: '\n',
            }
        }

    EOF
        = !.

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
