
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

namespace KaryScriptCompiler.Parser {

    //
    // ─── BASE NODE ──────────────────────────────────────────────────────────────────
    //

        export interface Base {
            type: "Empty" | "NumericLiteral" | "StringInterpolation" | "StringLiteral" |
                "BooleanLiteral" | "LineTerminator" | "ReservedValueLiterals" | "ArrayLiteral" |
                "ObjectLiteral" | "Identifier" | "UnaryOperator" | "AddressIdentifier" | 
                "Assignment" | "ReturnStatement" | "ClassDeceleration" | "FunctionDeceleration" |
                "DecelerationStatement" | "SpecialCommand" | "SExpression" | "ReturnKeyword" | 
                "PipeStatement" | "LambdaExpression" | "WhileStatement" | "ElseIfStatement" |
                "IfStatement" | "PipePlaceholder" | "ArrayDeceleration" | "AwaitStatement" | "ObjectDeceleration"
        }

    //
    // ─── BODY ───────────────────────────────────────────────────────────────────────
    //

        export type Body = Statements[ ] | Empty

        export interface Empty extends Base {
            type: "Empty"
        }

    //
    // ─── STATEMENTS ─────────────────────────────────────────────────────────────────
    //

        export type Statements
            = ArrayDeceleration

    //
    // ─── EXPRESSION ─────────────────────────────────────────────────────────────────
    //

        export type Expression
            = SExpression
            | ReservedValueLiterals
            | Literals

    //
    // ─── LITERALS ───────────────────────────────────────────────────────────────────
    //

        export type Literals
            = NumericLiteral
            | StringLiteral
            | BooleanLiteral

    //
    // ─── RESERVED VALUES ────────────────────────────────────────────────────────────
    //

        export type ReservedValues
            = boolean
            | number
            | undefined
            | null

    //
    // ─── RETURNABLES ────────────────────────────────────────────────────────────────
    //

        export type Returnables
            = Expression
            | SExpression

    //
    // ─── LAMBDA EXPRESSION ──────────────────────────────────────────────────────────
    //

        export interface LambdaExpression extends Base {
            type: "LambdaExpression"
            args: string[ ]
            code: Body
        }

    //
    // ─── PIPE STATEMENT ─────────────────────────────────────────────────────────────
    //

        export interface PipeStatement extends Base {
            type:   "PipeStatement"
            levels: Identifier | SExpression | ReturnKeyword | Returnables
        }

    //
    // ─── RETURN KEYWORD ─────────────────────────────────────────────────────────────
    //

        export interface ReturnKeyword extends Base {
            type: "ReturnKeyword"
            keyword: string
        }

    //
    // ─── AWAIT STATEMENT ────────────────────────────────────────────────────────────
    //

        export interface AwaitStatement extends Base {
            type: "AwaitStatement"
            expr: SExpression
        }

    //
    // ─── OBJECT DECELERATION ────────────────────────────────────────────────────────
    //

        export interface ObjectDeceleration extends Base {
            type:   "ObjectDeceleration"
            name:   string
            value:  ObjectMemberPair[ ]
        }

    //
    // ─── OBJECT LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface ObjectLiteral {
            type: "ObjectLiteral"
            value: ObjectMemberPair[ ]
        }

        export interface ObjectMemberPair {
            key: string
            value: Returnables
        }

    //
    // ─── ARRAY LITERAL ──────────────────────────────────────────────────────────────
    //

        export interface ArrayLiteral extends Base {
            type: "ArrayLiteral",
            value: Returnables[ ]
        }

    //
    // ─── ARRAY DECELERATION ─────────────────────────────────────────────────────────
    //

        export interface ArrayDeceleration extends Base {
            type:   "ArrayDeceleration"
            name:   string
            value:  Returnables[ ]
        }

    //
    // ─── RESERVED VALUE LITERALS ────────────────────────────────────────────────────
    //

        export interface ReservedValueLiterals extends Base {
            raw: string,
            value: ReservedValues
        }

    //
    // ─── STRING LITERAL ─────────────────────────────────────────────────────────────
    //

        export interface StringLiteral extends Base {
            key:    "'" | '"'
            value:  Array< StringPart | SExpression >
        }

        export interface StringPart extends Base {
            part:   string
        }

    //
    // ─── S EXPRESSION ───────────────────────────────────────────────────────────────
    //

        export interface SExpression extends Base {
            type:       "SExpression"
            kind:       SExpressionType
        }

        export type SExpressionType
            = "FunctionCallWithArgs"
            | "BinaryOperator"
            | "UnaryOperator"
            | "FunctionCallOnly"

        export interface FunctionCallWithArgsSExpression extends SExpression {
            kind:       "FunctionCallWithArgs"
            command:    AddressOrIdentifier
            params:     Returnables[ ]
        }

        export interface BinaryOperatorSExpression extends SExpression {
            kind:       "BinaryOperator"
            operator:   string
            left:       Expression
            right:      Expression
        }

        export interface UnaryOperatorSExpression extends SExpression {
            kind:       "UnaryOperator"
            operator:   string
            arg:        Expression
        }

        export interface FunctionCallOnlySExpression extends SExpression {
            kind:       "FunctionCallOnly"
            command:    AddressOrIdentifier
        }

    //
    // ─── IDENTIFIER AND ADDRESS ─────────────────────────────────────────────────────
    //

        export type AddressOrIdentifier = AddressIdentifier | Identifier

        export interface AddressIdentifier extends Base {
            type:   "AddressIdentifier"
            address: string[ ]
        }

        export interface Identifier extends Base {
            type: "Identifier"
            name: string
        }

    //
    // ─── BOOLEAN LITERAL ────────────────────────────────────────────────────────────
    //

        export interface BooleanLiteral extends Base {
            type:   "BooleanLiteral"
            key:    string
            value:  boolean
        }

    //
    // ─── NUMERIC LITERALS ───────────────────────────────────────────────────────────
    //

        export interface NumericLiteral extends Base {
            type:   "NumericLiteral"
            raw:    string,
            value:  number
        }

    // ────────────────────────────────────────────────────────────────────────────────

}