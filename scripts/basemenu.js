Events.on(ClientLoadEvent, () => {
    // icons menu
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
    // extra dialog
    let extraDialog = new BaseDialog("Extra");
    extraDialog.addCloseButton();

    extraDialog.cont.button("Icons", () => {
        iconDialog.show();
    }).width(280).height(60);

    /*
    edit blocks content dialog
    */
    let contentBlocksEditDialog = new BaseDialog("Edit");
    contentBlocksEditDialog.addCloseButton()
    let blockPane;
    let selectPane;
    function updateBlock(block) {
        // please dont question this code
        // life will change got me a little
        // TOO motivated
        contentBlocksEditDialog.cont.clear();
        blockPane = contentBlocksEditDialog.cont.pane(p => {
            p.image(new TextureRegionDrawable(block.icon(Cicon.full)));
            p.row();
            p.add(new Label(block.localizedName));
            p.row();
            p.row();
            Object.keys(block).forEach(key => {
                let value = block[key];
                if (typeof value === "string" || typeof value === "number") {
                    p.add(new Label(key));
                    p.row();
                    //textfield
                    if (typeof value === "string") {
                        p.field(value, s => {
                            if (s === "") return;
                            block[key] = s
                        });
                    };
                    if (typeof value === "number") {
                        p.field(value, TextField.TextFieldFilter.digitsOnly, s => {
                            if (s === "") return;
                            block[key] = parseInt(s)
                        });
                    };
                    p.row();
                    p.row()
                }
            });
            // lmao i just realized this is useless and doesn't actually do anything
            /*
            let visibilities = [
                BuildVisibility.hidden,
                BuildVisibility.shown,
                BuildVisibility.debugOnly,
                BuildVisibility.editorOnly,
                BuildVisibility.sandboxOnly,
                BuildVisibility.campaignOnly,
                BuildVisibility.lightingOnly,
                BuildVisibility.ammoOnly
                ]
            let visibilitiesName = [
                "Hidden",
                "Shown",
                "Debug Only",
                "Editor Only",
                "Sandbox Only",
                "Campaign Only",
                "Lighting Only",
                "Ammo Only"
                ]
            let label = p.add(new Label("buildVisibility"))
            p.row();
            let slider = new Slider(0, visibilities.length - 1, 1, false);
            slider.moved((count) => {
                label.get().text = visibilitiesName[count]
            });

            p.add(slider);
            */
        });
        blockPane.width(192 * 2);
        contentBlocksEditDialog.cont.pane(selectPane).width(192 * 2);
    }
    selectPane = (p) => {
        let indec = 0
        Vars.content.blocks().each((block) => {
            indec = indec + 1
            let icon = new TextureRegionDrawable(block.icon(Cicon.full));
            p.button(icon, () => {
                updateBlock(block)
            }).size(64);
            print(indec % 4)
            if ((indec % 4) == 0) p.row();
        });
    };
    contentBlocksEditDialog.cont.pane(selectPane).width(192 * 2);

    /*
    Object.keys(block).forEach(key => {
                let value = block[key];
                if (typeof value === "string") {
                    print(key + ": " + value)
                }
            });
    */
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
    terminal dialog
    */
    let terminalDialog = new BaseDialog("Terminal");
    terminalDialog.addCloseButton();
    
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
    let dialog = new BaseDialog("Modding Tools");
    dialog.addCloseButton();

    dialog.cont.button("Content",
        Icon.book,
        () => {
            contentDialog.show();
        }).width(280).height(60);
    dialog.cont.row()
    
    dialog.cont.button("Terminal",
        Icon.terminal,
        () => {
            terminalDialog.show();
        }).width(280).height(60);
    dialog.cont.row();

    dialog.cont.button("Extra",
        Icon.star, () => {
            extraDialog.show();
    }).width(280).height(60);

    /*
    adding the button
    */
    const tl = Vars.ui.hudGroup.getChildren().get(3);
    const mobile = tl.find("mobile buttons"), stat = tl.cells;

    if (!tl || !mobile || !stat) return;

    mobile.button(Icon.wrench, Styles.clearTransi, () => {
        dialog.show();
    }).name("modding-tools");

    mobile.image().color(Pal.gray).width(4).fill();

    // align 'waves/editor' table to the left
    stat.get(2).left();
});