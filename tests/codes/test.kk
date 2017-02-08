def x = (mul 11 (sum 5 6))
def y = (mul 34 (sum 5 (foo-bar 4 5)))
def m n k

m = 5
x/y/z = (foo-bar 5 on)

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


def lambda = [ p1 p2 p3 => (sum p1 p2) -> (mul $ p3) -> (div 4 $) ]

def cool = (x) -> (div $ 2) -> (z) ->
           (mul $ 5) -> (foo-bar) -> (go)


def str = "2 + 3 = #(sum 2 3)"

if on:
    (foo 1)
also unless (y):
    (foo 2)
also if (x) -> (z):
    (foo 3)
else
    (foo 4)
end

while (not off):
    (console/log "hello world")
end

def s1 = "this is a text"
def s2 = "#(sum 1 2)"
def s3 = "text with interpolation: #(mul (x)->(y) 4)"


async delay time:
    return new (Promise [ res => (setTimeout res time) ])
end

await (delay 5000)