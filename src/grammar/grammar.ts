
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── BASE NODE ──────────────────────────────────────────────────────────────────
//

    export interface Base {
        type: (
            "Empty" | "NumericLiteral" | "StringInterpolation" | "StringLiteral" |
            "BooleanLiteral" | "LineTerminator" | "ReservedValueLiterals" | "ArrayLiteral" |
            "ObjectLiteral" | "Identifier" | "UnaryOperator" | "AddressIdentifier" | 
            "Assignment" | "ReturnStatement" | "ClassDeceleration" | "FunctionDeceleration" |
            "DecelerationStatement" | "SpecialCommand" | "SExpression" | "ReturnKeyword" | 
            "PipeStatement" | "LambdaExpression" | "WhileStatement" | "ElseIfStatement" |
            "IfStatement"
        )
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

    export type SExpressionType = (
        "FunctionCallWithArgs" | "BinaryOperator" | "UnaryOperator" |
        "FunctionCallOnly" )

    export interface SExpression extends Base {
        kind:       SExpressionType
        command:    AddressOrIdentifier
    }

    export interface FunctionCallWithArgsSExpression extends SExpression {
        params: Base[ ]
    }

//
// ─── IDENTIFIER AND ADDRESS ─────────────────────────────────────────────────────
//

    export type AddressOrIdentifier = Address | Identifier

    export interface Address extends Base {
        address: string[ ]
    }

    export interface Identifier extends Base {
        name: string
    }

//
// ─── ARRAY LITERAL ──────────────────────────────────────────────────────────────
//

    export interface ArrayLiteral extends Base {
        value: Base[ ]
    }

//
// ─── BOOLEAN LITERAL ────────────────────────────────────────────────────────────
//

    export interface BooleanLiteral extends Base {
        key: string
        value: boolean
    }

//
// ─── NUMERIC LITERALS ───────────────────────────────────────────────────────────
//

    export interface NumericLiteral extends Base {
        raw:    string,
        value:  number
    }

// ────────────────────────────────────────────────────────────────────────────────
