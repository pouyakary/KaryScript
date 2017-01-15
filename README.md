
# KaryScript
Is a sugar syntactic language like CoffeeScript that targets TypeScript. The only reason for this language is have a much more readable and beautiful syntax for JS/TS. For now it's only about ideas on how the language should look and interact with runtime and nothing more really.

<img width="739" alt="screen shot 2017-01-15 at 5 11 28 pm" src="https://cloud.githubusercontent.com/assets/2157285/21962969/3fb7ccfa-db46-11e6-8ff0-182d47a1f123.png">
 

## Ideas?
#### Grammar
Having a clean grammar much like ruby:
```
def function-name param1: string param2: number as boolean
    ...
end
```

#### Names
Identifiers can have `dash` in their names like: `my-beloved-name` and also the dot nation will be replaced with slashes so like: `some-namespace/my-function`

#### Pipes
Pipes give so much cleaner look to the language:
```
async something as number
    await kary/terminal/input "Enter something" > mul 5 > plus 2 > return
end
```
And this compiles to:
```js
async function something( ): number {
    return ( 2 + ( 5 * ( await kary.terminal.input( "Enter something" ) ) ) )
}
```

#### S-Expression
S-Expressions are nice ways to write functions and they are so much cleaner:
```
(add 4 5)
```

#### Better loops:
```
for i from 1 to 5
    (do something)
end
```