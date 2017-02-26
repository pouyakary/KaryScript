
zone a:
    export def x = 2
    zone b:
        zone c:
            def y = 2
            (foo x y)
        end
    end
end