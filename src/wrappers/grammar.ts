
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScriptCompiler.AST {

    //
    // ─── BASE NODE ──────────────────────────────────────────────────────────────────
    //

        export interface IBase {
            type: "Body" | "Empty" | "NumericLiteral" | "StringInterpolation" | "StringLiteral" |
                "BooleanLiteral" | "LineTerminator" | "ReservedValueLiterals" | "ArrayLiteral" |
                "ObjectLiteral" | "Identifier" | "UnaryOperator" | "AddressIdentifier" | 
                "Assignment" | "ReturnStatement" | "ClassDeceleration" | "FunctionDeceleration" |
                "DecelerationStatement" | "SpecialCommand" | "SExpression" | "ReturnKeyword" | 
                "PipeStatement" | "LambdaExpression" | "WhileStatement" | "ElseIfStatement" |
                "IfStatement" | "PipePlaceholder" | "ArrayDeceleration" | "AwaitStatement" | "ObjectDeceleration" | "Predicate"
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
            = IArrayDeceleration
            | IObjectDeceleration
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

        export interface IPipeStatement extends IBase {
            type:   "PipeStatement"
            levels: IIdentifier | ISExpression | IReturnKeyword | TReturnables
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
    // ─── OBJECT DECELERATION ────────────────────────────────────────────────────────
    //

        export interface IObjectDeceleration extends IBase {
            type:   "ObjectDeceleration"
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
    // ─── ARRAY DECELERATION ─────────────────────────────────────────────────────────
    //

        export interface IArrayDeceleration extends IBase {
            type:   "ArrayDeceleration"
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
            value:  Array< IStringPart | ISExpression >
        }

        export interface IStringPart extends IBase {
            part:   string
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