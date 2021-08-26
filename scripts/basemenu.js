Events.on(ClientLoadEvent, () => {
    let fartsound = loadSound("fart")
    let dialog = new BaseDialog("Modding Tools");
    dialog.addCloseButton();

    //unit spawn dialog stolen from Abreaker
    let spawner = new BaseDialog("Spawn");

    spawner.addCloseButton();

    spawner.cont.image().color(Pal.accent).fillX().height(3).pad(3);
    spawner.cont.row();

    let selected = UnitTypes.dagger
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

    s.button("Spawn",
        () => {
            if (Units.canCreate(Vars.player.team(), selected)) {
                let unit = selected.create(Vars.player.team());
                unit.set(Vars.player.x, Vars.player.y);
                unit.add();
            }
        }).size(120,
        64)

    spawner.cont.add(s);
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

    extraDialog.cont.button("Icons", Icon.bookOpen, () => {
        iconDialog.show();
    }).width(280).height(60);
    extraDialog.cont.row()
    extraDialog.cont.button("fart", Icon.warning, () => {
        extraDialog.hide();
        dialog.hide();
        fartsound.at(Vars.player.x,
            Vars.player.y)
        Vars.player.unit().health = 0
    }).width(280).height(60);
    /*
    edit unit content dialog
    */
    let contentUnitsEditDialog = new BaseDialog("Edit");
    contentUnitsEditDialog.addCloseButton();
    let unitPane;
    let unitSelectPane;
    function updateUnit(unit) {
        contentUnitsEditDialog.cont.clear();
        unitPane = contentUnitsEditDialog.cont.pane(p => {
            p.image(new TextureRegionDrawable(unit.icon(Cicon.full)));
            p.row();
            p.add(new Label(unit.localizedName));
            p.row();
            p.row();
            Object.keys(unit).forEach(key => {
                let value;
                try {
                    value = unit[key];
                } catch(e) {
                    return;
                }
                if (typeof value === "object") {
                    if (value instanceof TextureRegion) {
                        p.add(new Label(key));
                        p.row();
                        p.table(cons(t => {
                            let myimagecell;
                            t.field("", s => {
                                if (s === "") return;
                                myimagecell.get().setDrawable(new TextureRegionDrawable(Core.atlas.find(s)))
                                unit[key] = Core.atlas.find(s)
                                });
                                t.row();
                                myimagecell = t.image(new TextureRegionDrawable(value))
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
                                unit[key] = s
                            });
                        };
                        if (typeof value === "number") {
                            p.field(value, TextField.TextFieldFilter.digitsOnly, s => {
                                if (s === "") return;
                                unit[key] = parseInt(s)
                            });
                        };
                        p.row();
                        p.row();
                    }
                });
            });
            unitPane.width(192 * 2);
            contentUnitsEditDialog.cont.pane(unitSelectPane).width(192 * 2);
        }
        unitSelectPane = (p) => {
            let indec = 0
            //CHANGE
            Vars.content.units().each((unit) => {
                indec = indec + 1
                let icon = new TextureRegionDrawable(unit.icon(Cicon.full));
                p.button(icon, () => {
                    updateUnit(unit)
                }).size(64);
                if ((indec % 4) == 0) p.row();
            });
        };
        contentUnitsEditDialog.cont.pane(unitSelectPane).width(192 * 2);

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
                effectsDialog.hide();
                dialog.hide();
                let evalEffect = new Effect(120, (e) => eval(effectString))
                evalEffect.at(Vars.player.x, Vars.player.y, 0);
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
                Vars.ui.announce("not yet");
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
                if (Vars.state.isGame() && Core.input.keyTap(KeyCode.n)) {
                    dialog.show();
                }});
        }
    });