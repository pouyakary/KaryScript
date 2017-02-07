def x = (mul 11 (sum 5 6))
def y = (mul 34 (sum 5 (foo-bar 4 5)))
def m n k
con f = (and on off)
con number255 = 0xff

(console/log (x) -> (div $ 8))
(foo-bar)

export def man-man:
    def SecondLevel:
        throw (foo 10 20) -> (div $ 5)
    end
    def something = 5
end

def lambda = [ par1 par2 => (sum par1 par2) ]

def cool = (x) -> (div $ 2) -> (z) ->
            (mul $ 5) -> (foo-bar) -> (go)

def str = "2 + 3 = #(sum 2 3)"

def s1 = "this is a text"
def s2 = "#(sum 1 2)"
def s3 = "text with interpolation: #(mul 5 4)"

async delay time:
    return new (Promise [ res => (setTimeout res time) ])
end

await (delay 5000)