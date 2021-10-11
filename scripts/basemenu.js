// [REQUIRE]

let loadedClient = false;
let select = require("selector");

Events.on(ClientLoadEvent, () => {
    loadedClient = true;

    // [SHOW_TERMINAL]

    let shown = false;
    function toggle() {
        const frag = Vars.ui.scriptfrag;
        frag.clearChildren();

        frag.table(null, t => {
            t.defaults().size(48);

            t.button(Icon.pencil, Styles.clearTransi, () => frag.toggle());
            t.button(Icon.trash, Styles.clearTransi, () => frag.clearMessages());
        });

        frag.visibility = () => shown;
        shown = (shown == false);
    }

    // [FART]

    let fartsound = loadSound("fart");
    function farter() {
        fartsound.at(Vars.player.x,
            Vars.player.y);
        Vars.player.unit().kill();
    }

    // [DIALOG]

    let dialog = new BaseDialog("Modding Tools");
    dialog.addCloseButton();

    // [SPAWNER]

    let spawner = new BaseDialog("Spawn");

    spawner.addCloseButton();

    spawner.cont.image().color(Pal.accent).fillX().height(3).pad(3);
    spawner.cont.row();

    let selected = UnitTypes.dagger;
    let list = new Table();
    const units = Vars.content.units();
    units.sort();
    let i = 0;
    units.each(unit => {
        if (unit.isHidden()) return;
        if ((i++ % 6) == 0) list.row();
        const ic = new TextureRegionDrawable(unit.icon(Cicon.full));
        list.button(ic, () => {
            selected = unit;
            //button.style.imageUp = ic;
        }).size(96);
    });
    list.top().center();
    spawner.cont.row();

    let t = new Table();
    t.left().bottom();
    t.defaults().left();

    spawner.cont.add(t);
    spawner.cont.row();
    spawner.cont.pane(list).growX();
    spawner.cont.row();
    spawner.cont.image().color(Pal.accent).fillX().height(3).pad(3);
    spawner.cont.row();

    let s = new Table();

    s.label(() => "Selected: " + selected.localizedName);

    s.row();

    s.button("Spawn",
        () => {
            if (Units.canCreate(Vars.player.team(), selected)) {
                let unit = selected.create(Vars.player.team());
                unit.set(Vars.player.x, Vars.player.y);
                unit.add();
            }
        }).size(120,
        64);

    spawner.cont.add(s);

    // [ICONS]

    let iconDialog = new BaseDialog("Icons");

    iconDialog.addCloseButton();
    iconDialog.cont.pane(t => {
        let r = 0;

        // add a button for each icon
        Icon.icons.each((name, icon) => {
            t.button(new TextureRegionDrawable(icon), Styles.cleari, () => {
                Vars.ui.announce(name); // show icon's name
            }).size(48).pad(4);

            // new row for every 10 buttons/icons
            if (++r % 10 == 0) t.row();
        });
    }).size(640, 640);

    // [EXTRA]

    let extraDialog = new BaseDialog("Extra");
    extraDialog.addCloseButton();

    extraDialog.cont.button("Icons", Icon.bookOpen, () => {
        iconDialog.show();
    }).width(280).height(60);
    extraDialog.cont.row();
    extraDialog.cont.button("fart", Icon.warning, () => {
        extraDialog.hide();
        dialog.hide();
        farter();
    }).width(280).height(60);

    // [EDIT] [UNIT]

    let contentUnitsEditDialog = new BaseDialog("Edit");
    select(contentUnitsEditDialog, Vars.content.units());

    // [EDIT] [BLOCKS]

    let contentBlocksEditDialog = new BaseDialog("Edit");
    select(contentBlocksEditDialog, Vars.content.blocks());

    /*
    Object.keys(block).forEach(key => {
                let value = block[key];
                if (typeof value === "string") {
                    print(key + ": " + value)
                }
            });
    */
    /*
    units content dialog
    */
    let contentUnitsDialog = new BaseDialog("Units");
    contentUnitsDialog.addCloseButton()

    contentUnitsDialog.cont.button("Edit",
        Icon.edit,
        () => {
            contentUnitsEditDialog.show();
        }).width(280).height(60);
    contentUnitsDialog.cont.row();

    contentUnitsDialog.cont.button("Spawn",
        Icon.add,
        () => {
            spawner.show();
        }).width(280).height(60);
    /*
    blocks content dialog
    */
    let contentBlocksDialog = new BaseDialog("Blocks");
    contentBlocksDialog.addCloseButton()

    contentBlocksDialog.cont.button("Edit",
        Icon.edit,
        () => {
            contentBlocksEditDialog.show();
        }).width(280).height(60);
    /*
    tables dialog
    */
    let string;
    let tableDialog = new BaseDialog("Table Editor");
    tableDialog.addCloseButton();

    tableDialog.cont.add(new Label("insert code"));
    tableDialog.cont.row();
    tableDialog.cont.field("",
        s => {
            if (s === "") return;
            string = s
        });
    tableDialog.cont.row();
    tableDialog.cont.button("Preview",
        () => {
            try {
                let evaledDialog = new BaseDialog("Preview");
                evaledDialog.addCloseButton();
                // eval(string)
                evaledDialog.cont.table(cons(t => eval(string)));
                evaledDialog.show()
            } catch (e) {
                tableDialog.cont.row();
                tableDialog.cont.pane(p => {
                    p.add(new Label(e.toString()))
                })
            }
        }).width(280).height(60);

    /*
    terminal dialog
    */
    let terminalDialog = new BaseDialog("Terminal");
    terminalDialog.addCloseButton();

    /*
    effects dialog
    */
    let effectString;
    let effectsDialog = new BaseDialog("Effect Spawner");
    effectsDialog.addCloseButton();

    effectsDialog.cont.field("",
        s => {
            if (s === "") return;
            effectString = s
        });
    effectsDialog.cont.row();
    effectsDialog.cont.button("Spawn",
        () => {
            try {
                let evalEffect = new Effect(120, (e) => eval(effectString))
                evalEffect.at(Vars.player.x, Vars.player.y, 0);
                effectsDialog.hide();
                dialog.hide();
            } catch (e) {
                effectsDialog.cont.row();
                effectsDialog.cont.pane(p => {
                    p.add(new Label(e.toString()))
                })
            }
        }).width(280).height(60);

    /*
    content dialog
    */
    let contentDialog = new BaseDialog("Content");
    contentDialog.addCloseButton();

    contentDialog.cont.button("Blocks",
        () => {
            contentBlocksDialog.show();
        }).width(280).height(60);

    contentDialog.cont.row();

    contentDialog.cont.button("Units",
        () => {
            contentUnitsDialog.show();
        }).width(280).height(60);
    /*
    base dialog
    */

    dialog.cont.button("Content",
        Icon.book,
        () => {
            contentDialog.show();
        }).width(280).height(60);
    dialog.cont.row();

    dialog.cont.button("Effects",
        Icon.fileImage,
        () => {
            effectsDialog.show();
        }).width(280).height(60);
    dialog.cont.row();

    dialog.cont.button("Table",
        Icon.edit,
        () => {
            tableDialog.show();
        }).width(280).height(60);
    dialog.cont.row();

    dialog.cont.button("Terminal",
        Icon.terminal,
        () => {
            // terminalDialog.show();
            toggle();
        }).width(280).height(60);
    dialog.cont.row();

    dialog.cont.button("Extra",
        Icon.star,
        () => {
            extraDialog.show();
        }).width(280).height(60);

    /*
    adding the button
    */
    if (Vars.mobile) {
        const tl = Vars.ui.hudGroup.getChildren().get(3);
        const mobile = tl.find("mobile buttons"),
        stat = tl.cells;

        if (!tl || !mobile || !stat) return;

        mobile.button(Icon.wrench, Styles.clearTransi, () => {
            dialog.show();
        }).name("modding-tools");

        mobile.image().color(Pal.gray).width(4).fill();

        // align 'waves/editor' table to the left
        stat.get(2).left();
    } else {
        Events.run(Trigger.update, () => {
            if (Vars.state.isGame() && Core.input.keyTap(KeyCode.f9.ordinal())) {
                dialog.show();
            }});
    }
});
