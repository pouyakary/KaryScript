
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

        //
        // ─── GENERATE ID ─────────────────────────────────────────────────
        //

            function id ( ) {
                return ''
                /* return String.fromCharCode( 65 + Math.floor( Math.random( ) * 26 ) )
                    + Date.now().toString( ).substring( 8 ) */
    
            }

        // ─────────────────────────────────────────────────────────────────
    }

//
// ─── ROOT ───────────────────────────────────────────────────────────────────────
//

    Root = Body / Empty

//
// ─── BODY ───────────────────────────────────────────────────────────────────────
//

    Body
        = PlainWhiteSpace* statements:SpacedStatements+ {
            return {
                type:       'Body',
                location:   location( ),
                id:         id( ),
                branch:     statements
            }
        }
        / Empty

//
// ─── SPACES STATEMENTS ──────────────────────────────────────────────────────────
//

    SpacedStatements
        = statement:Statement {
            return statement
        }
        / PlainWhiteSpace+
        / LineTerminator

    FullPlainWhiteSpace
        = LineTerminator
        / PlainWhiteSpace
    

    EmptyLineStatement
        = PlainWhiteSpace* LineTerminator {
            return {
                type: "EmptyLine",
                location: location,
                id: id( ),
            }
        }

    StetamentEnd
        = ( LineTerminator / EOF )

//
// ─── STATEMENTS ─────────────────────────────────────────────────────────────────
//

    Statement
        = InlineComment
        / FunctionDeclaration
        / ClassDeclaration
        / ArrayDeclaration
        / ObjectDeclaration
        / DeclarationStatement
        / SingleAssignmentStatement
        / IfStatement
        / WhileStatement
        / ReturnStatement
        / PipeExpression
        / SExpression

//
// ─── RETURNABLES ────────────────────────────────────────────────────────────────
//

    Returnables
        = DeclarationAssignment
        / Expression

    ArgumentReturnables
        = Returnables
        / PipePlaceholder
        / SExpressionBody

//
// ─── SINGLE EXPRESSION ─────────────────────────────────────────────────────────
//

    Expression
        = Literals
        / Identifier
        / ArrayObjectIndexLoader
        / LambdaExpression
        / PipeExpression
        / ShorthandIfExpression
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
        / TableLiteral

//
// ─── CONDITIONABLE ──────────────────────────────────────────────────────────────
//

    ConditionalsPredicate
        = __+ predicate:Predicate __* EndStructureSign {
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
                  type:         "IfStatement",
                  location:     location( ),
                  id:           id( ),
                  key:          key,
                  kind:         "if",
                  predicate:    predicate,
                  trueBranch:   body
              }
          }
        / key:IfSwitchKey predicate:ConditionalsPredicate trueBranch:Body "else"
          falseBranch:Body END {
              return {
                  type:         "IfStatement",
                  location:     location( ),
                  id:           id( ),
                  key:          key,
                  kind:         "if-else",
                  predicate:    predicate,
                  trueBranch:   trueBranch,
                  falseBranch:  falseBranch
              }
          }
        / key:IfSwitchKey predicate:ConditionalsPredicate trueBranch:Body
          elseIfBranches: ElseIfStatementArray "else" falseBranch:Body END {
              return {
                  type:             "IfStatement",
                  location:         location( ),
                  id:               id( ),
                  key:              key,
                  kind:             "if-elseif-else",
                  predicate:        predicate,
                  trueBranch:       trueBranch,
                  elseIfBranches:   elseIfBranches,
                  falseBranch:      falseBranch
              }
          }

    IfSwitchKey
        = key:( "if" / "unless" ) {
            return key
        }

    ElseIfStatementArray
        = elesIfClouse:ElseIfStatement more:ElseIfStatementArray {
            return [ elesIfClouse ].concat( more )
        } 
        / elesIfClouse:ElseIfStatement {
            return [ elesIfClouse ]
        }

    ElseIfStatement
        = FullPlainWhiteSpace* "also" PlainWhiteSpace+ key:IfSwitchKey
          predicate:ConditionalsPredicate body:Body {
            return {
                type:       "ElseIfStatement",
                location:   location( ),
                id:         id( ),
                key:        key,
                predicate:  predicate,
                trueBranch: body
            }
        }

//
// ─── SHORTHAND RETURN IF ────────────────────────────────────────────────────────
//

    ShorthandIfExpression
        = expr:SExpression _* "?" _* trueExpression:ArgumentReturnables _* "!" _* falseExpression:ArgumentReturnables {
            return {
                type:               "ShorthandIfExpression",
                location:           location( ),
                id:                 id( ),
                predicate:          expr,
                trueExpression:     trueExpression,
                falseExpression:    falseExpression
            }
        }
          
//
// ─── WHILE STATEMENT ────────────────────────────────────────────────────────────
//

    WhileStatement
        = "while" predicate:ConditionalsPredicate
          body:Body END {
              return {
                  type:         "WhileStatement",
                  location:     location( ),
                  id:           id( ),
                  predicate:    predicate,
                  body:         body
              }
        }

//
// ─── LAMBDA EXPRESSIONS ─────────────────────────────────────────────────────────
//

    LambdaExpression
        = "[" __* args:IdentifierList __* "=>" __* code:ArgumentReturnables __* "]" {
            return {
                type:       "LambdaExpression",
                location:   location( ),
                id:         id( ),
                args:       args.map( x => x.name ),
                code:       code
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

    PipeExpression
        = origin:SExpression PipeControl parts:PipeExpressionParts {
            return {
                type:       "PipeExpression",
                location:   location( ),
                id:         id( ),
                levels:     [ origin ].concat( parts )
            }
        }

    PipeExpressionParts
        = origin:SExpression PipeControl more:PipeExpressionParts {
            return [ origin ].concat( more )
        }
        / terminal: SExpression {
            return [ terminal ]
        }

    PipeControl
        = __* "->" __*

//
// ─── RETURN KEYWORD ─────────────────────────────────────────────────────────────
//

    ReturnKeyword
        = keyword: ( "return" / "yield" / "throw" ) {
            return {
                type:       "ReturnKeyword",
                location:   location( ),
                id:         id( ),
                keyword:    keyword
            }
        }

//
// ─── S EXPRESSION ───────────────────────────────────────────────────────────────
//

    SExpression
        = "(" __* body:( SExpressionBody  / UnaryExpressionBody ) __* ")" {
            return body
        }
        / UnaryExpressionBody

    UnaryExpressionBody
        = operator:UnaryOperator __+ arg:Expression {
            return {
                type:       "SExpression",
                location:   location( ),
                id:         id( ),
                kind:       "UnaryOperator",       
                operator:   operator,
                arg:        arg
            }
        }

    SExpressionBody
        = command:AddressIdentifier __+ params:SExpressionArugmentArray {
            return {
                type:       "SExpression",
                location:   location( ),
                id:         id( ),
                kind:       "FunctionCallWithArgs",
                command:    command,
                params:     params,
            }
        }
        / operator:BinaryOperator __+ left:ArgumentReturnables __+ right:ArgumentReturnables {
            return {
                type:       "SExpression",
                location:   location( ),
                id:         id( ),
                kind:       "BinaryOperator",       
                operator:   operator.operator,
                left:       left,
                right:      right 
            }
        }
        / command:AddressIdentifier {
            return {
                type:       "SExpression",
                location:   location( ),
                id:         id( ),
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

//
// ─── CLASS DECLERATION ──────────────────────────────────────────────────────────
//

    ClassDeclaration
        = exported:ExportKey "class" _+ name:Identifier origin:ClassExtends? _* 
          EndStructureSign __* defs:ClassFunctionDeclarations __* END {
            return {
                type:       'ClassDeclaration',
                location:   location( ),
                id:         id( ),
                name:       name.name,
                exported:   exported,
                defs:       defs,
                origin:     origin
            }
        }
        / exported:ExportKey "class" _+ name:Identifier
          origin:ClassExtends? _* EndStructureSign _* END {
            return {
                type:       'ClassDeclaration',
                location:   location( ),
                id:         id( ),
                name:       name.name,
                exported:   exported,
                defs:       null,
                origin:     origin
            }
        }

    ClassExtends
        = _+ 'extends' _+ origin:AddressIdentifier {
            return origin
        }

    ClassFunctionDeclarations
        = arg:FunctionDeclaration __+ more:ClassFunctionDeclarations {
            return [ arg ].concat( more )
        } 
        / decleration:FunctionDeclaration {
            return [ decleration ]
        }

//
// ─── FUNCTION DECLERATION ───────────────────────────────────────────────────────
//

    FunctionDeclaration
        = exported:ExportKey key:FunctionDefKind _+ name:Identifier _* args:IdentifierList
        __* EndStructureSign code:Body END {
            return {
                type:       "FunctionDeclaration",
                location:   location( ),
                id:         id( ),
                name:       name.name,
                key:        key,
                exported:   exported,
                args:       args.map( x => x.name ),
                code:       code
            }
        }
        / exported:ExportKey key:FunctionDefKind __+ name:Identifier __* EndStructureSign __* code:Body END {
            return {
                type:       "FunctionDeclaration",
                location:   location( ),
                id:         id( ),
                name:       name.name,
                key:        key,
                exported:   exported,
                args:       null,
                code:       code
            }
        }

    FunctionDefKind
        = type:( 'def' / 'async' ) {
            return type
        }

//
// ─── TABLE LITERAL ──────────────────────────────────────────────────────────────
//

    TableLiteral =
        "|" header: TableColumnHeader _* EOL
        _* "|" _* TableHeaderLines _* EOL
        _* data:TableBody {
            return {
                type:       "TableLiteral",
                id:         id( ),
                location:   location( ),
                header:     header,
                data:       data
            }
        }


    // header
    TableColumnHeader
        = member:TableColumnHeaderMember more:TableColumnHeader {
            return [ member ].concat( more )
        } 
        / member: TableColumnHeaderMember {
            return [ member ]
        }

    TableColumnHeaderMember
        = _* name:( "#" / Identifier ) _* "|" {
            if ( name === "#" )
                return "#"
            else
                return name.name
        }


    // LineTerminatorSequence
    TableHeaderLines
        = TableHeaderSingleColumnLine TableHeaderLines
        / TableHeaderSingleColumnLine

    TableHeaderSingleColumnLine
        = _* "-"+ _* "|"


    // Table Body
    TableBody
        = member:TableRow _* EOL _* more:TableBody {
            return [ member ].concat( more )
        } 
        / member: TableRow {
            return [ member ]
        }

    TableRow
        = "|" members:TableRowMemebers {
            return members
        }
        
    TableRowMemebers
        = member:TableRowSingleMember more:TableRowMemebers {
            return [ member ].concat( more )
        } 
        / member: TableRowSingleMember {
            return [ member ]
        }

    TableRowSingleMember
        = _* expr:Expression _* "|" {
            return expr
        }
        / _+ "|" {
            return {
                type:       "EmptyCell",
                id:         id( ),
                location:   location( ),
            }
        }

//
// ─── EXPORT KEY ─────────────────────────────────────────────────────────────────
//

    ExportKey
        = key:("export" _)? _* {
            return key? true : false
        }

//
// ─── DEFINE STATEMENT ───────────────────────────────────────────────────────────
//

    DeclarationStatement
        = exported:ExportKey modifier:( "con" / "def" ) _+ assignment:DeclarationAssignment {
            return {
                type:       'DeclarationStatement',
                location:   location( ),
                id:         id( ),
                kind:       'SingleAllocInit',
                exported:   exported,
                modifier:   modifier,
                assignment: assignment
            }
        }
        / exported:ExportKey "def" _+ names:NameOnlyDeclarationsArray  {
            return {
                type:       'DeclarationStatement',
                location:   location( ),
                id:         id( ),
                kind:       'MultiAlloc',
                exported:   exported,
                names:      names.map( x => x.name )
            }
        }

    NameOnlyDeclarationsArray
        = name:Identifier _+ more:NameOnlyDeclarationsArray {
            return [ name ].concat( more )
        } 
        / name:Identifier {
            return [ name ]
        }

//
// ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
//

    ReturnStatement
        = keyword:ReturnKeyword _+ expr:ArgumentReturnables {
            return {
                type:       'ReturnStatement',
                location:   location( ),
                id:         id( ),
                kind:       keyword.keyword,
                value:      expr
            }
        }
        / keyword:ReturnKeyword {
            return {
                type:       'ReturnStatement',
                location:   location( ),
                id:         id( ),
                kind:       keyword.keyword,
                value:      null
            }
        }

//
// ─── ASSIGN STATEMENT ───────────────────────────────────────────────────────────
//

    DeclarationAssignment
        = name:Identifier __* "=" __* value:Returnables {
            return {
                type:       'DeclarationAssignment',
                location:   location( ),
                id:         id( ),
                name:       name.name,
                value:      value
            }
        }

//
// ─── SINGLE ASSIGNMENT ──────────────────────────────────────────────────────────
//

    SingleAssignmentStatement
        = name:AddressIdentifier __* "=" __* value:Returnables {
            return {
                type:       'SingleAssignmentStatement',
                location:   location( ),
                id:         id( ),
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
                type:       "AddressIdentifier",
                location:   location( ),
                id:         id( ),
                address:    ( member.type === "Identifier" )
                            ? [ space.name, member.name ]
                            : [ space.name ].concat( member.address )
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
                type:       'Identifier',
                location:   location( ),
                id:         id( ),
                name:       inetiferStart + tail.join('')
            }
        }

//
// ─── BINARY OPERATORS ───────────────────────────────────────────────────────────
//

    BinaryOperator
        = op:( 'div' / 'sub' / 'sum' / 'mul' / 'pow' / 'mod' / 'and' / 'or' / 
               '=' / '>' / '<' / '<=' / '!=' / 'eq' ) {
            return {
                type:       'BinaryOperator',
                location:   location( ),
                id:         id( ),
                operator:   op
            }
        }

//
// ─── UNARAY OPERATORS ───────────────────────────────────────────────────────────
//

    UnaryOperator
        = "not" / "async" / "await" / "new" / "delete" / "typeof" / "void"

//
// ─── INDEX LOADER ───────────────────────────────────────────────────────────────
//

    ArrayObjectIndexLoader
        = "[" __* name:AddressIdentifier __* "|" __* index:Returnables __* "]" {
            return {
                type:       "ArrayObjectIndexLoader",
                location:   location( ),
                id:         id( ),
                name:       name,
                index:      index
            }
        }

//
// ─── OBJECT LITERALS ────────────────────────────────────────────────────────────
//

    ObjectLiteral
        = "[" __* ObjectAssignmentKeyValueCharacter __* "]" {
            return {
                type:       "ObjectLiteral",
                location:   location( ),
                id:         id( ),
                value:      [ ]
            }
        }
        / "[" __* members:ObjectPairMember __* "]" {
            return {
                type:       "ObjectLiteral",
                location:   location( ),
                id:         id( ),
                value:      members
            }
        }
      
    ObjectDeclaration
        = exported:ExportKey "object" __* name:Identifier __* EndStructureSign
          __* members:ObjectPairMember __+ END {
            return {
                type:       "ObjectDeclaration",
                location:   location( ),
                id:         id( ),
                name:       name.name,
                value:      members,
                exported:   exported
            }
        }

    ObjectPairMember
        = member:ObjectAssignment _* ( LineTerminator / "," ) _*
          more:ObjectPairMember {
            return [ member ].concat( more )
        } 
        / member:ObjectAssignment {
            return [ member ]
        }

    ObjectAssignment
        = name:Identifier _* ObjectAssignmentKeyValueCharacter _* value:ArgumentReturnables {
            return {
                key:    name.name,
                value:  value
            }
        }

    ObjectAssignmentKeyValueCharacter = ":"

//
// ─── ARRAY LITERALS ─────────────────────────────────────────────────────────────
//

    ArrayLiteral
        = "[" __* "]" {
            return {
                type:       "ArrayLiteral",
                location:   location( ),
                id:         id( ),
                value:      [ ]
            }
        }
        / "[" __* members:ArrayMember __* "]" {
            return {
                type:       "ArrayLiteral",
                location:   location( ),
                id:         id( ),
                value:      members
            }
        }

    ArrayDeclaration
        = exported:ExportKey "array" _+ name:Identifier __* EndStructureSign __* members:ArrayMember __+ END {
            return {
                type:       "ArrayDeclaration",
                location:   location( ),
                id:         id( ),
                name:       name.name,
                exported:   exported,
                value:      members
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
            / "also"            !IdentifierName
            / "and"             !IdentifierName
            / "or"              !IdentifierName
            / "not"             !IdentifierName
            / "ufo"             !IdentifierName
            / "sub"             !IdentifierName
            / "mul"             !IdentifierName
            / "div"             !IdentifierName
            / "sum"             !IdentifierName
            / "pow"             !IdentifierName
            / "mod"             !IdentifierName
            / "on"              !IdentifierName
            / "off"             !IdentifierName
            / "true"            !IdentifierName
            / "false"           !IdentifierName
            / "yes"             !IdentifierName
            / "no"              !IdentifierName
            / "right"           !IdentifierName
            / "wrong"           !IdentifierName
            / "not"             !IdentifierName
            / "cat"             !IdentifierName
            / "print"           !IdentifierName
            / "nan"             !IdentifierName
            / "con"             !IdentifierName

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
                type:       "ReservedValueLiterals",
                location:   location( ),
                id:         id( ),
                raw:        value,
                value:      result
            }
        }

//
// ─── BOOLEAN ────────────────────────────────────────────────────────────────────
//

    BooleanLiteral
        = key:( 'on' / 'off' / 'true' / 'false' / 'yes' / 'no' / 'right' / 'wrong' ) {
            let result = true
            switch ( key ) {
                case 'off':
                case 'false':
                case 'no':
                case 'wrong':
                    result = false
            }
            return {
                type:       'BooleanLiteral',
                location:   location( ),
                id:         id( ),
                key:        key,
                value:      result
            }
        }

//
// ─── STRING ─────────────────────────────────────────────────────────────────────
//

    StringLiteral
        = '"' body:( DoubleQuotesStringsParts )* '"' {
            return {
                type:       "StringLiteral",
                location:   location( ),
                id:         id( ),
                key:        '"',
                parts:      generateStringResult( body ),
            }
        }
        / "'" body:( SingleQuotesStringsParts )* "'" {
            return {
                type:       "StringLiteral",
                location:   location( ),
                id:         id( ),
                key:        "'",
                parts:      generateStringResult( body ),
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
            return expr
        }

//
// ─── NUMBER ─────────────────────────────────────────────────────────────────────
//

    NumericLiteral
        = sign:'-'? '0x' numerics:[0-9a-f]+ {
            let number = ( sign? sign : '' ) + '0x' + numerics.join('')
            return {
                type:       'NumericLiteral',
                location:   location( ),
                id:         id( ),
                raw:        number,
                value:      eval( number )
            }
        }
        / sign:'-'? start:[0-9]+ decimals:('.'[0-9]+)? {
            let number = (
                ( sign? sign : '' ) + start.join('') +
                ( decimals? '.' + decimals[ 1 ].join('') : '' )
            )
            return {
                type:       'NumericLiteral',
                location:   location( ),
                id:         id( ),
                raw:        number,
                value:      decimals? parseFloat( number ) : parseInt( number )
            }
        }

//
// ─── PIPE HOLDER ────────────────────────────────────────────────────────────────
//

    PipePlaceholder
        = "$" {
            return {
                type:       "PipePlaceholder",
                id:         id( ),
                location:   location( ),
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
// ─── COMMENTS ───────────────────────────────────────────────────────────────────
//

    InlineComment
        = '//' text:(!EOL .)* {
            return {
                type:       "InlineComment",
                location:   location( ),
                id:         id( ),
                comment:    text.map( x => x[ 1 ] ).join('')
            }
        }

//
// ─── SPECIAL CHARACTERS ─────────────────────────────────────────────────────────
//

    EndStructureSign = ":"

//
// ─── WHITESPACE ─────────────────────────────────────────────────────────────────
//

    Empty
        = FullPlainWhiteSpace* {
            return {
                type:       'Empty',
                location:   location( ),
                id:         id( ),
            }
        }
    _
        = PlainWhiteSpace
        / InlineComment

    EOL
        = _* LineTerminator {
            return {
                type:       'LineTerminator',
                location:   location( ),
                id:         id( ),
            }
        }

    EOF
        = !.


    PlainWhiteSpace
        = spaces:( "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF" / SeperatorSpaces ) {
            return {
                type:       '_',
                location:   location( ),
                id:         id( ),
                value:      spaces
            }
        }

    LineTerminator
        = [\n\r\u2028\u2029] {
            return {
                type:       'LineTerminator',
                location:   location( ),
                id:         id( ),
            }
        }

    LineTerminatorSequence
        = ( "\n"  / "\r\n" / "\r" / "\u2028" / "\u2029" ) {
            return {
                type:       'LineTerminatorSequence',
                location:   location( ),
                id:         id( ),
            }
        }

    SeperatorSpaces = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

// ────────────────────────────────────────────────────────────────────────────────
