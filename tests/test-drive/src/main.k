

        fix simpsons =
            | name      | age       |
            |-----------|-----------|
            | "Homer"   | 38        |
            | "Marge"   | 38        |
            | "Bart"    | 10        |
            | "Lisa"    | 8         |
            | "Maggie"  | 1         |

        (main) def main:
            (get-adult-names simpsons) -> (wrap-names)
                -> (React/render 'container')
        end

        def get-adult-names group:
            mut teens = [ ]
            for member of group when member/age > 18:
                (teens/push member/name)
            end
        end

        def wrap-names names:
            @body = (names/map to name do
                        return <Text>{ name }</Text>
                    end)
            return <View>{ @body }</View>
        end