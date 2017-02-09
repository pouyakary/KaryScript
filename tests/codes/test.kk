
//
// Copyright © 2017-present Kary Foundation, Inc. All rights reserved.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    def x = (mul 11 (sum 5 6))
    def y = (mul 34 (sum 5 (foo-bar 4 5)))
    def m n k

//
// ─── ASSIGNS ────────────────────────────────────────────────────────────────────
//

    m = 5
    x/y/z = (foo-bar 5 on)

//
// ─── OPERATIONS ─────────────────────────────────────────────────────────────────
//

    con f = (and on off)
    con number255 = 0xff

    (console/log (x) -> (div $ 8))
    (foo-bar)

//
// ─── ARRAYS ─────────────────────────────────────────────────────────────────────
//

    x = [ 1 2 "hello world" (x)->(y) ]

//
// ─── OBJECTS ────────────────────────────────────────────────────────────────────
//

    y = [
        a: 1, b: "hello"
        c: (x) -> (y) -> (div $ 2)
        d: [ hello: "hello" ]
    ]

    z = [:]

//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
//

    export def man-man:
        def SecondLevel:
            throw (foo 10 20) -> (div $ 5)
        end
        def something = 5
    end

//
// ─── LAMBDA ─────────────────────────────────────────────────────────────────────
//

    def lambda = [ p1 p2 p3 => (sum p1 p2) -> (mul $ p3) -> (div 4 $) ]

//
// ─── PIPE ───────────────────────────────────────────────────────────────────────
//
        
    def cool = (x) -> (div $ 2) -> (z) ->
            (mul $ 5) -> (foo-bar) -> (go)

//
// ─── STRING INTERPOLATION ───────────────────────────────────────────────────────
//

    def str = "2 + 3 = #(sum 2 3)"

    def s1 = "this is a text"
    def s2 = "#(sum 1 2)"
    def s3 = "text with interpolation: #(mul (x)->(y) 4)"

//
// ─── IFS ────────────────────────────────────────────────────────────────────────
//

    if on:
        (foo 1)
    also unless (y):
        (foo 2)
    also if (x) -> (z):
        (foo 3)
    else
        (foo 4)
    end

    x = (eq 1 1)? on ! off

//
// ─── WHILE ──────────────────────────────────────────────────────────────────────
//

    while (not off):
        (console/log "hello world")
    end

//
// ─── ASYNC AWAIT ────────────────────────────────────────────────────────────────
//

    async delay time:
        return new (Promise [ res => (setTimeout res time) ])
    end

    await (delay 5000)

//
// ─── CLASS DECLARATIONS ─────────────────────────────────────────────────────────
//

    class Foo:
        def constructor x:
            this/x = x
        end
    end

    class X extends Y:
        def something y:
            (foo)
        end
    end

// ────────────────────────────────────────────────────────────────────────────────
