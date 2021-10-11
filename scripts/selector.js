function key_check(index, p, element, key) {
    let value;
    try {
        value = element[key];
    } catch(e) {
        return index;
    }
    index++;
    if (typeof value === "object") {
        if (value instanceof TextureRegion) {
            p.add(new Label(key));
            p.row();
            p.table(cons(t => {
                let myimagecell;
                t.field(value.toString(), s => {
                    if (s === "") return;
                    myimagecell.get().setDrawable(new TextureRegionDrawable(Core.atlas.find(s)));
                    element[key] = Core.atlas.find(s);
                });
                t.row();
                myimagecell = t.image(new TextureRegionDrawable(value));
            }));
            p.row();
        }
    }
    if (typeof value === "string" || typeof value === "number") {
        p.add(new Label(key));
        p.row();
        //textfield
        if (typeof value === "string") {
            p.field(value, s => {
                if (s === "") return;
                element[key] = s;
            });
        }
        if (typeof value === "number") {
            p.field(value, TextField.TextFieldFilter.digitsOnly, s => {
                if (s === "") return;
                element[key] = parseInt(s);
            });
        }
        p.row();
        p.row();
    }
    return index;
}

function select(dialog, seq) {
    dialog.cont.pane(cont => {
        let index2 = 0;
        seq.each((element) => {
            index2 = index2 + 1;
            let icon = new TextureRegionDrawable(element.icon(Cicon.full));
            cont.button(icon,
                () => {
                    let editElementDialog = new BaseDialog(element.localizedName);
                    editElementDialog.addCloseButton();
                    editElementDialog.cont.pane(p => {
                        p.image(new TextureRegionDrawable(element.icon(Cicon.full)));
                        p.row();
                        p.add(new Label(element.localizedName));
                        p.row();
                        p.row();
                        let index = 0;
                        Object.keys(element).forEach(key => {
                            index = key_check(index, p, element, key);
                        });
                    }).width(500);
                    editElementDialog.show();
                }).size(64);
            if ((index2 % 4) == 0) cont.row();
        });
    });
    dialog.addCloseButton();
}

module.exports = select;
