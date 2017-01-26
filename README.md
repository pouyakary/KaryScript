
# KaryScript
KaryScript is an experimental project to bring a better syntax for more readability. That's our only goal: Readability in the code. It compiles to JavaScript. If the experiment goes well we might even integrate it to the TypeScript compiler services and let you have a powerful tooling alongside of it.


## Ideas?
#### Grammar
Having a clean grammar much like ruby:
```
def function-name param1 param2:
    ...
end
```

#### Names
Identifiers can have `dash` in their names like: `my-beloved-name` and also the dot nation will be replaced with slashes so like: `some-namespace/my-function`

#### Pipes
Pipes give so much cleaner look to the language:
```
async something
    (await kary/terminal/input "Enter something") > (mul 5) > (plus 2) > return
end
```
And this compiles to:
```TypeScript
async function something( ){
    return ( 2 + ( 5 * ( await kary.terminal.input( "Enter something" ) ) ) )
}
```

#### S-Expression
S-Expressions are nice ways to write functions and they are so much cleaner:
```
(sum 4 5)
```

#### Lambda Expressions
```
-- inline ones
def add = [ x y => (sum x y) ]
( arr/map [ x => (mul x 2) ] ) 

-- multi lines (anonymous functions)
def x = func x:
    return (pow x 2)
end
```

#### Comments
```
-- inline
(* multi line *)
```

#### Better loops:
```
for i from 1 to 5:
    (do/something)
end
```

### Many literals
Inspired by CoffeeScript you can have many kinds of `true` / `false` keywords:
```
def foo:
    def bar = on
        bar = off
        bar = right
        bar = wrong
        bar = true
        bar = false
        bar = yes
        bar = no
end
```

### Assignments
Both functions and variables are defined within `def` keyword, yo do:
```
def foo = [ x y => (bar x y) ]
def foo = 5
def foo x y:
    return (bar x y)
end
```
And it detects the global and local scopes:
```
space x:
    def foo = 5 (* compiles to let foo *)
end
def bar = 5 (* compiles to var bar *)
```

### String Interpolation
```
(* x will be: "foo 10" *)
def x = "foo #(+ 2 3 5)"
```