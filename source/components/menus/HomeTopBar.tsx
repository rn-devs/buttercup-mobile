import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
    Avatar,
    Button,
    Divider,
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    Text
} from "@ui-kitten/components";
import { notifyError, notifySuccess } from "../../library/notifications";
import { setBusyState } from "../../services/busyState";
import { lockAllVaults } from "../../services/buttercup";

interface HomeTopBarProps {
    leftMenu?: "vaults" | null;
    navigation: any;
}

const BCUP_ICON = require("../../../resources/images/bcup-256.png");
const MENU_ITEMS = [
    { text: "Add Vault", slug: "add", icon: "plus-outline" },
    { text: "Manage Vaults", slug: "manage", icon: "menu-arrow-outline" },
    { text: "Lock All Vaults", slug: "lock-all", icon: "lock-outline" },
    { text: "About", slug: "about", icon: "info-outline" }
];

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        marginHorizontal: 4
    },
    menuContent: {}
});

async function handleAllVaultLocking() {
    setBusyState("Locking vaults");
    await lockAllVaults();
    setBusyState(null);
    notifySuccess("Vaults locked", "All vaults have been locked");
}

function MenuButton(props) {
    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const onItemSelect = selected => {
        const item = MENU_ITEMS[selected.row];
        setVisible(false);
        if (item.slug === "about") {
            navigation.navigate("About");
        } else if (item.slug === "add") {
            navigation.navigate("AddVault");
        } else if (item.slug === "manage") {
            navigation.navigate("ManageVaults");
        } else if (item.slug === "lock-all") {
            handleAllVaultLocking().catch(err => {
                setBusyState(null);
                console.error(err);
                notifyError("Locking Failure", err.message);
            });
        }
    };

    const renderToggleButton = () => (
        <Button
            {...props}
            appearance="ghost"
            accessoryLeft={MenuIcon}
            onPress={() => setVisible(true)}
            status="basic"
        />
    );

    return (
        <Layout style={styles.menuContent} level="1">
            <OverflowMenu
                anchor={renderToggleButton}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
            >
                {MENU_ITEMS.map(item => (
                    <MenuItem
                        key={item.slug}
                        title={item.text}
                        accessoryLeft={props => <Icon {...props} name={item.icon} />}
                    />
                ))}
            </OverflowMenu>
        </Layout>
    );
}

function MenuIcon(props) {
    return <Icon {...props} name="menu-outline" />;
}

export function HomeTopBar(props: HomeTopBarProps) {
    const {
        leftMenu = null,
        navigation
    } = props;
    return (
        <>
            <TopNavigation
                title={props => (
                    <Layout style={styles.header}>
                        <Avatar
                            shape="square"
                            size="tiny"
                            source={BCUP_ICON}
                            style={styles.logo}
                        />
                        <Text {...props} category="h5">
                            Buttercup
                        </Text>
                    </Layout>
                )}
                alignment="center"
                accessoryLeft={props =>
                    leftMenu === "vaults"
                        ? <MenuButton {...props} navigation={navigation} />
                        : null
                }
            />
            <Divider />
        </>
    );
}
