
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScript.Compiler.AST {

    //
    // ─── LOCATION ───────────────────────────────────────────────────────────────────
    //

        export interface ILocation {
            start:  IPosition
            end:    IPosition
        }

        export interface IPosition {
            offset: number
            line:   number
            column: number
        }

    //
    // ─── BASE NODE ──────────────────────────────────────────────────────────────────
    //

        export interface IBase {
            type: "Root"
                | "Body"
                | "Empty"
                | "NumericLiteral"
                | "StringInterpolation"
                | "StringLiteral"
                | "BooleanLiteral"
                | "LineTerminator"
                | "ReservedValueLiterals"
                | "SingleAssignmentStatement"
                | "ShorthandIfExpression"
                | "ArrayLiteral"
                | "ObjectLiteral"
                | "Identifier"
                | "UnaryOperator"
                | "AddressIdentifier"
                | "Assignment"
                | "ReturnStatement"
                | "ClassDeclaration"
                | "FunctionDeclaration"
                | "DeclarationStatement"
                | "ArrayObjectIndexLoader"
                | "SpecialCommand"
                | "SExpression"
                | "ReturnKeyword"
                | "PipeExpression"
                | "LambdaExpression"
                | "WhileStatement"
                | "ForStatement"
                | "ElseIfStatement"
                | "SwitchStatement"
                | "IfStatement"
                | "PipePlaceholder"
                | "ArrayDeclaration"
                | "AwaitStatement"
                | "ObjectDeclaration"
                | "Predicate"
                | "DeclarationAssignment"
                | "StringPart"
                | "InlineComment"
                | "CaseStatement"
                | "Selector"
                | "EmptyCell"
                | "TableLiteral"
                | "SetLiteral"
                | "MapLiteral"
                | "TableRow"
                | "Octothorpe"
                | "HolderDeclarationStatement"
                | "HolderIdentifier"
                | "Comparison"
                | "ExpressionMember"
                | "UseStatement"
                | "TryCatchStatement"
                | "ZoneDeclaration"
                | "RegExpLiteral"
                | "ReservedIdentifiers"

            location: ILocation

            id: string
        }

    //
    // ─── RESERVED IDENTIFIERS ───────────────────────────────────────────────────────
    //

        export interface IReservedIdentifiers extends IBase {
            name:       string
        }

    //
    // ─── REGEXP LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface IRegExpLiteral extends IBase {
            pattern:    string
            flags:      string
        }

    //
    // ─── ZONE DECLARATION ───────────────────────────────────────────────────────────
    //

        export interface IZoneDeclaration extends IBase {
            body:       IBody
            kind:       'named' | 'not-named'
        }

        export interface INamedZone extends IZoneDeclaration {
            kind:       'named'
            name:       IAddressIdentifier | IIdentifier
        }

        export interface ISimpleZone extends IZoneDeclaration {
            kind:       'not-named'
        }

    //
    // ─── TRY CATCH STATEMENT ────────────────────────────────────────────────────────
    //

        export interface ITryCatchStatement extends IBase {
            body:                 IBody
            exceptionIdentifier:  IIdentifier | null
            catchBody:            IBody | null
            finallyBody:          IBody | null
        }

    //
    // ─── USE STATEMENT ──────────────────────────────────────────────────────────────
    //

        export interface IUseStatement extends IBase {
            kind:           'from-origin' | 'simple'
        }

        export interface IUseStatementSimpleImport extends IUseStatement {
            kind:           'simple'
            args:           IIdentifier[ ]
        }

    //
    // ─── LITERAL MEMBER CALL ────────────────────────────────────────────────────────
    //

        export interface IExpressionMember extends IBase {
            expr:           IBase
            member:         IAddressIdentifier | IIdentifier
        }

    //
    // ─── COMPARISON ─────────────────────────────────────────────────────────────────
    //

        export interface IComparison extends IBase {
            key:            '==' | '<=' | '>=' | '!=' | '<' | '>' | 'and' | 'or',
            left:           IBase,
            right:          IBase,
        }

    //
    // ─── HOLDERS ────────────────────────────────────────────────────────────────────
    //

        export interface IHolderDeclarationStatement extends IBase {
            holder:         IHolderIdentifier,
            value:          IBase
        }

        export interface IHolderIdentifier extends IBase {
            name:           string
        }

    //
    // ─── SWITCH STATEMENT ───────────────────────────────────────────────────────────
    //

        export interface ISwitchStatement extends IBase {
            switchable:     TExpression,
            cases:          ICaseStatement[ ],
            defaultBody?:   IBody
        }

        export interface ICaseStatement extends IBase {
            cases:          TExpression[ ],
            body:           IBody
        }

    //
    // ─── FOR STATEMENT ──────────────────────────────────────────────────────────────
    //

        export interface IForStatement extends IBase {
            type:           'ForStatement'
            kind:           'repeat' | 'foreach'
            body:           IBase
        }

        export interface IRepeatForLoop extends IForStatement {
            kind:           'repeat'
            direction:      boolean
            indexVar:       IIdentifier | null
            step:           TExpression | null
            range:          ForRange
        }

        interface ForRange {
            start:          TExpression | null
            end:            TExpression
        }

        export interface IForeachForLoop extends IForStatement {
            kind:           'foreach'
            key:            "in" | "of"
            iterator:       IIdentifier,
            iterable:       TExpression,
            predicate:      IBase | null,
            body:           IBody
        }

    //
    // ─── CLASS DECLARATION ──────────────────────────────────────────────────────────
    //

        export interface IClassDeclaration extends IExportable {
            name:           IIdentifier
            defs:           IFunctionDeclaration[ ]
            origin:         IAddressIdentifier
        }

    //
    // ─── WHILE STATEMENT ────────────────────────────────────────────────────────────
    //

        export interface IWhileStatement extends IBase {
            predicate:      IBase
            body:           IBody
        }

    //
    // ─── IF STATEMENTS ──────────────────────────────────────────────────────────────
    //

        export interface IIfStatement extends IBase {
            key:            'if' | 'unless'
            kind:           'if' | 'if-elseif-else' | 'if-else'
            predicate:      IBase
        }

        export interface ISimpleIf extends IIfStatement {
            trueBranch:     IBody
        }

        export interface IIfWithElse extends IIfStatement {
            trueBranch:     IBody
            falseBranch:    IBody
        }

        export interface IIfWithElseIfAndElse extends IIfWithElse {
            elseIfBranches: ISimpleIf[ ]
        }

    //
    // ─── SHORTHAND IF ───────────────────────────────────────────────────────────────
    //

        export interface IShorthandIfExpression extends IBase {
            predicate:          IBase
            trueExpression:     TExpression
            falseExpression:    TExpression
        }

    //
    // ─── PREDICATE ──────────────────────────────────────────────────────────────────
    //

        export interface IPredicate extends IBase {
            condition: IBase
        }

    //
    // ─── EXPORTABLE ─────────────────────────────────────────────────────────────────
    //

        export interface IExportable extends IBase {
            exported: boolean
        }

    //
    // ─── FUNCTION DECLARATION ───────────────────────────────────────────────────────
    //

        export interface IFunctionDeclaration extends IExportable {
            name:   IIdentifier
            key:    "def" | "async"
            args:   IIdentifier[ ] | null
            code:   IBody
        }

    //
    // ─── BODY ───────────────────────────────────────────────────────────────────────
    //

        export interface IBody extends IBase {
            type:   "Body"
            branch: TStatements[ ] | IEmpty
        }

        export interface IEmpty extends IBase {
            type:   "Empty"
        }

    //
    // ─── STATEMENTS ─────────────────────────────────────────────────────────────────
    //

        export type TStatements
            = IArrayDeclaration
            | IObjectDeclaration
            | ISExpression

    //
    // ─── EXPRESSION ─────────────────────────────────────────────────────────────────
    //

        export type TExpression
            = ISExpression
            | IReservedValueLiterals
            | TLiterals

    //
    // ─── LITERALS ───────────────────────────────────────────────────────────────────
    //

        export type TLiterals
            = INumericLiteral
            | IStringLiteral
            | IBooleanLiteral

    //
    // ─── RESERVED VALUES ────────────────────────────────────────────────────────────
    //

        export type TReservedValues
            = boolean
            | number
            | undefined
            | null

    //
    // ─── RETURNABLES ────────────────────────────────────────────────────────────────
    //

        export type TReturnables
            = TExpression
            | ISExpression

    //
    // ─── OCTOTHORPE ─────────────────────────────────────────────────────────────────
    //

        export interface IOctothorpe extends IBase {
            type:       "Octothorpe"
        }

    //
    // ─── TABLE LITERAL ──────────────────────────────────────────────────────────────
    //

        export type THeaderable = IIdentifier | IOctothorpe

        export interface ITableLiteral extends IBase {
            header:     THeaderable[ ]
            data:       ITableRow[ ]
        }

        export interface ITableRow extends IBase {
            cells:      IBase[ ]
        }

    //
    // ─── SELECTOR EXPRESSION ────────────────────────────────────────────────────────
    //

        export interface ISelector extends IBase {
            type:           "Selector"
            searchable:     IAddressIdentifier
            kind:           "query" | "range"
        }

        export interface IQuerySelector extends ISelector {
            kind:           "query",
            queries:        IBase[ ]
        }

        export interface IRangeSelector extends ISelector {
            kind:           "range"
            start:          IBase
            end:            IBase
        }

    //
    // ─── INLINE COMMENT ─────────────────────────────────────────────────────────────
    //

        export interface IInlineComment extends IBase {
            comment:    IIdentifier
        }

    //
    // ─── SINGLE ASSIGNMENT STATEMENT ────────────────────────────────────────────────
    //

        export interface ISingleAssignmentStatement extends IBase {
            name:       IAddressIdentifier
            value:      TReturnables
            key:        '=' | '/=' | '?='
        }

    //
    // ─── RETURN STATEMENT ───────────────────────────────────────────────────────────
    //

        export interface IReturnStatement extends IBase {
            kind:  'return' | 'throw' | 'yield'
            value: IBase | null
        }

    //
    // ─── DECLARATION STATEMENT ─────────────────────────────────────────────────────
    //

        export interface DeclarationStatementBase extends IExportable {
            type: "DeclarationStatement"
            kind: "SingleAllocInit" | "MultiAlloc"
        }
        
        export interface SingleAllocInitDeclaration extends DeclarationStatementBase {
            kind:       "SingleAllocInit"
            modifier:   "con" | "def"
            assignment: DeclarationAssignment
        }

        export interface MultiAllocDeclaration extends DeclarationStatementBase {
            kind: "MultiAlloc"
            names: IIdentifier[ ]
        }

    //
    // ─── DECLARATION ASSIGNMENT ────────────────────────────────────────────────────
    //

        export interface DeclarationAssignment extends IExportable {
            type:   "DeclarationAssignment"
            name:   IIdentifier
            value:  TReturnables
        }

    //
    // ─── PREDICATE ──────────────────────────────────────────────────────────────────
    //

        export interface Predicate extends IBase {
            type: "Predicate",
            condition: IBase
        }

    //
    // ─── LAMBDA EXPRESSION ──────────────────────────────────────────────────────────
    //

        export interface ILambdaExpression extends IBase {
            type: "LambdaExpression"
            args: IIdentifier[ ]
            code: IBody
        }

    //
    // ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
    //

        export interface IPipeExpression extends IBase {
            type:   "PipeExpression"
            levels: ISExpression[ ]
        }

    //
    // ─── RETURN KEYWORD ─────────────────────────────────────────────────────────────
    //

        export interface IReturnKeyword extends IBase {
            type:       "ReturnKeyword"
            keyword:    string
        }

    //
    // ─── AWAIT STATEMENT ────────────────────────────────────────────────────────────
    //

        export interface IAwaitStatement extends IBase {
            type: "AwaitStatement"
            expr: ISExpression
        }

    //
    // ─── OBJECT DECLARATION ────────────────────────────────────────────────────────
    //

        export interface IObjectDeclaration extends IExportable {

            name:   IIdentifier
            value:  IObjectMemberPair[ ]
            kind:   "object" | "template"
        }

    //
    // ─── OBJECT LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface IObjectLiteral extends IBase {
            value: IObjectMemberPair[ ]
        }

        export interface IObjectMemberPair extends IBase {
            key:    IIdentifier
            value:  TReturnables
        }

    //
    // ─── MAP LITERAL ────────────────────────────────────────────────────────────────
    //

        export interface IMapLiteral extends IBase {
            value: IMapMemberPair[ ]
        }

        export interface IMapMemberPair extends IBase {
            key:    TExpression
            value:  TReturnables
        }


    //
    // ─── ARRAY LITERAL ──────────────────────────────────────────────────────────────
    //

        export interface IArrayLiteral extends IBase {
            value:  TReturnables[ ]
        }

    //
    // ─── SET LITERAL ────────────────────────────────────────────────────────────────
    //

        export interface ISetLiteral extends IBase {
            value:  TReturnables[ ]
        }

    //
    // ─── ARRAY DECLARATION ─────────────────────────────────────────────────────────
    //

        export interface IArrayDeclaration extends IExportable {
            type:   "ArrayDeclaration"
            name:   IIdentifier
            value:  TReturnables[ ]
        }

    //
    // ─── RESERVED VALUE LITERALS ────────────────────────────────────────────────────
    //

        export interface IReservedValueLiterals extends IBase {
            raw:    string,
            value:  TReservedValues
        }

    //
    // ─── STRING LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface IStringLiteral extends IBase {
            key:    "'" | '"'
            parts:  Array< IStringPart | ISExpression >
        }

        export interface IStringPart extends IBase {
            part: string
        }

    //
    // ─── S EXPRESSION ───────────────────────────────────────────────────────────────
    //

        export interface ISExpression extends IBase {
            type: "SExpression"
            kind: TSExpressionType
        }

        export type TSExpressionType
            = "FunctionCallWithArgs"
            | "BinaryOperator"
            | "UnaryOperator"
            | "FunctionCallOnly"

        export interface IFunctionCallWithArgsSExpression extends ISExpression {
            kind:       "FunctionCallWithArgs"
            command:    TAddressOrIdentifier | IExpressionMember
            params:     TReturnables[ ]
        }

        export interface IBinaryOperatorSExpression extends ISExpression {
            kind:       "BinaryOperator"
            operator:   string
            left:       TExpression
            right:      TExpression
        }

        export interface IUnaryOperatorSExpression extends ISExpression {
            kind:       "UnaryOperator"
            operator:   string
            arg:        TExpression
        }

        export interface IFunctionCallOnlySExpression extends ISExpression {
            kind:       "FunctionCallOnly"
            command:    TAddressOrIdentifier
        }

    //
    // ─── IDENTIFIER AND ADDRESS ─────────────────────────────────────────────────────
    //

        export type TAddressOrIdentifier = IAddressIdentifier | IIdentifier

        export interface IAddressIdentifier extends IBase {
            type:       "AddressIdentifier"
            address:    IIdentifier[ ]
        }

        export interface IIdentifier extends IBase {
            type:   "Identifier"
            name:   string
        }

    //
    // ─── BOOLEAN LITERAL ────────────────────────────────────────────────────────────
    //

        export interface IBooleanLiteral extends IBase {
            type:   "BooleanLiteral"
            key:    string
            value:  boolean
        }

    //
    // ─── NUMERIC LITERALS ───────────────────────────────────────────────────────────
    //

        export interface INumericLiteral extends IBase {
            type:   "NumericLiteral"
            raw:    string,
            value:  number
        }

    // ────────────────────────────────────────────────────────────────────────────────

}