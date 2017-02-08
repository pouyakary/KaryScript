
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
                | "SpecialCommand"
                | "SExpression"
                | "ReturnKeyword"
                | "PipeExpression"
                | "LambdaExpression"
                | "WhileStatement"
                | "ElseIfStatement"
                | "IfStatement"
                | "PipePlaceholder"
                | "ArrayDeclaration"
                | "AwaitStatement"
                | "ObjectDeclaration"
                | "Predicate"
                | "DeclarationAssignment"
                | "StringPart"

            location: ILocation

            id: string
        }

    //
    // ─── WHILE STATEMENT ────────────────────────────────────────────────────────────
    //

        export interface IWhileStatement extends IBase {
            predicate: IBase
            body: IBody
        }

    //
    // ─── IF STATEMENTS ──────────────────────────────────────────────────────────────
    //

        export interface IIfStatement extends IBase {
            key: 'if' | 'unless'
            kind: 'if' | 'if-elseif-else' | 'if-else'
            predicate: IBase
        }

        export interface ISimpleIf extends IIfStatement {
            trueBranch: IBody
        }

        export interface IIfWithElse extends IIfStatement {
            trueBranch:   IBody
            falseBranch:  IBody
        }

        export interface IIfWithElseIfAndElse extends IIfWithElse {
            elseIfBranches: ISimpleIf[ ]
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
            name:   string
            key:    "def" | "async"
            args:   string[ ] | null
            code:   IBody
        }

    //
    // ─── BODY ───────────────────────────────────────────────────────────────────────
    //

        export interface IBody extends IBase {
            type: "Body"
            branch: TStatements[ ] | IEmpty
        }

        export interface IEmpty extends IBase {
            type: "Empty"
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
    // ─── SINGLE ASSIGNMENT STATEMENT ────────────────────────────────────────────────
    //

        export interface ISingleAssignmentStatement extends IBase {
            name:       IAddressIdentifier
            value:      TReturnables
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
            kind: "SingleAllocInit"
            modifier: "con" | "def"
            assignment: DeclarationAssignment
        }

        export interface MultiAllocDeclaration extends DeclarationStatementBase {
            kind: "MultiAlloc"
            names: string[ ]
        }

    //
    // ─── DECLARATION ASSIGNMENT ────────────────────────────────────────────────────
    //

        export interface DeclarationAssignment extends IExportable {
            type:   "DeclarationAssignment"
            name:   string
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
            args: string[ ]
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
            type: "ReturnKeyword"
            keyword: string
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
            type:   "ObjectDeclaration"
            name:   string
            value:  IObjectMemberPair[ ]
        }

    //
    // ─── OBJECT LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface IObjectLiteral {
            type: "ObjectLiteral"
            value: IObjectMemberPair[ ]
        }

        export interface IObjectMemberPair {
            key: string
            value: TReturnables
        }

    //
    // ─── ARRAY LITERAL ──────────────────────────────────────────────────────────────
    //

        export interface IArrayLiteral extends IBase {
            type: "ArrayLiteral",
            value: TReturnables[ ]
        }

    //
    // ─── ARRAY DECLARATION ─────────────────────────────────────────────────────────
    //

        export interface IArrayDeclaration extends IExportable {
            type:   "ArrayDeclaration"
            name:   string
            value:  TReturnables[ ]
        }

    //
    // ─── RESERVED VALUE LITERALS ────────────────────────────────────────────────────
    //

        export interface IReservedValueLiterals extends IBase {
            raw: string,
            value: TReservedValues
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
            command:    TAddressOrIdentifier
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
            type:   "AddressIdentifier"
            address: string[ ]
        }

        export interface IIdentifier extends IBase {
            type: "Identifier"
            name: string
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