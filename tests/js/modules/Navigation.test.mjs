import {beforeAll, beforeEach, expect, jest, test} from "@jest/globals";

/**
 * @jest-environment jsdom
 */
describe(
    "Compatibility with old lib.",
    () => {
        let old_navigation;
        let new_navigation;

        let header_element;
        let menu_toggle_element;
        let navigation_element;
        let overlay_element;
        let menu_link_elements;

        function reset_navigation() {
            header_element = document.createElement("header");
            header_element.classList.add("header");

            menu_toggle_element = document.createElement("button");
            menu_toggle_element.classList.add("header__menu-toggle");
            header_element.append(menu_toggle_element);

            navigation_element = document.createElement("div");
            navigation_element.classList.add("header__nav");
            header_element.append(navigation_element);

            overlay_element = document.createElement("div");
            overlay_element.classList.add("header__overlay");
            header_element.append(overlay_element);

            const menu_link_element_1 = document.createElement("div");
            menu_link_element_1.classList.add("header__menu-link");
            header_element.append(menu_link_element_1);

            const menu_link_element_2 = document.createElement("div");
            menu_link_element_2.classList.add("header__menu-link");
            header_element.append(menu_link_element_2);

            menu_link_elements = [
                menu_link_element_1,
                menu_link_element_2,
            ];

            document.body.innerHTML = "";
            document.body.append(header_element);
        }

        function toggle_menu(validation_definition) {
            document.test_data = {};
            const Navigation = validation_definition;
            const navigation_instance = new Navigation();
            document.test_data.before_click = document.body.innerHTML.replaceAll(/\s/g, "");
            menu_toggle_element.click();
            document.test_data.after_click = document.body.innerHTML.replaceAll(/\s/g, "");
            menu_toggle_element.click();
            document.test_data.after_second_click = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        function toggle_resize_events(validation_definition) {
            document.test_data = {};
            const Navigation = validation_definition;
            const navigation_instance = new Navigation();
            document.test_data.before_all = document.body.innerHTML.replaceAll(/\s/g, "");
            window.innerWidth = 100;
            window.dispatchEvent(new Event('resize'));
            menu_toggle_element.click();
            document.test_data.after_click = document.body.innerHTML.replaceAll(/\s/g, "");
            window.innerWidth = 2000;
            window.dispatchEvent(new Event('resize'));
            document.test_data.after_resize = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        beforeAll(
            async () => {
                old_navigation = (await import("./old/navigation.js"))["default"];
                new_navigation = (await import("../../../js/modules/Navigation.mjs"))["default"];
            }
        );

        beforeEach(
            () => {
                reset_navigation();
            }
        );

        test(
            "Toggle menu",
            () => {
                const old_data = toggle_menu(old_navigation);
                reset_navigation();
                const new_data = toggle_menu(new_navigation);
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
                expect(new_data.before_click).not.toEqual(new_data.after_click);
                expect(new_data.after_click).not.toEqual(new_data.after_second_click);
            }
        );

        test(
            "Resize events and it's classes",
            () => {
                const old_data = toggle_resize_events(old_navigation);
                reset_navigation();
                const new_data = toggle_resize_events(new_navigation);
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
                expect(new_data.before_all).toEqual(new_data.after_resize);
                expect(new_data.after_click).not.toEqual(new_data.after_resize);
            }
        );
    }
)