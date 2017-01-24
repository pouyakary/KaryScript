
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
(add 4 5)
```

### Lambda Expressions:
In this form:
```
def sum = [ x y => (+ x y) ]
```

### Comments
```
-- inline
(* multi line *)
```

#### Better loops:
```
for i from 1 to 5
    (do/something)
end
```