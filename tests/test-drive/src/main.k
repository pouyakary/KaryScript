

zone KaryScriptMonaco:

    //
    // ─── INFORMATION ────────────────────────────────────────────────────────────────
    //

        mut editor

    //
    // ─── INITIALIZER ────────────────────────────────────────────────────────────────
    //

        usable def Init:

            // a simple event
            window/onresize = do
                if editor != ufo:
                    (editor/layout)
                end
            end

            // and done, giving user our pointer
            return editor
        end
    // ────────────────────────────────────────────────────────────────────────────────

end
