import {beforeAll, beforeEach, expect, jest, test} from "@jest/globals";

/**
 * @jest-environment jsdom
 */
describe(
    "Compatibility with old lib.",
    () => {
        //Change this if your code needs more time to finish it's actions on the DOM
        const common_timeout_for_dom = 100;

        let old_modal;
        let new_modal;

        const on_click_1 = jest.fn(
            (event) => {console.log("on_click_1 handler")}
        );
        const on_click_2 = jest.fn(
            (event) => {console.log("on_click_2 handler")}
        );

        const create_args = {
            id: `its_a_id`,
            title: "test_title",
            content: "<div>TEST CONTENT!</div>",
            size: "md",
            actions: [
                {
                    label: "test_label_1",
                    variant: "primary",
                    onClick: on_click_1,
                },
                {
                    label: "test_label_2",
                    variant: "ghost",
                    onClick: on_click_2,
                }
            ],
            icon: "<div>Test ICON!!!</div>",
            iconType: "info",
        };

        const create_args_2 = {
            ...create_args,
            id: `its_a_id_2`,
        }

        const create_args_3 = {
            ...create_args,
            id: `its_a_id_3`,
        }

        async function create_and_close(modal_definition) {
            const Modal = modal_definition;
            document.test_data = {};
            const modal = new Modal();
            const id = modal.create(create_args);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_create = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.close(id);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_close = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        async function double_create_and_close(modal_definition) {
            const Modal = modal_definition;
            document.test_data = {};
            const modal = new Modal();
            const id = modal.create(create_args);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_create_1 = document.body.innerHTML.replaceAll(/\s/g, "");
            const id2 = modal.create(create_args_2);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_create_2 = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.close(id);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_close_1 = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.close(id2);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_close_2 = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        async function close_all(modal_definition) {
            const Modal = modal_definition;
            document.test_data = {};
            const modal = new Modal();
            const id = modal.create(create_args);
            const id2 = modal.create(create_args_2);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            modal.closeAll();
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_close_all = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        async function modal_templates(modal_definition) {
            const Modal = modal_definition;
            document.test_data = {};
            const modal = new Modal();
            const id = modal.success(create_args);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_success = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.close(id);
            const id2 = modal.error(create_args_2);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_error = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.close(id2);
            const id3 = modal.info(create_args_3);
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            document.test_data.after_info = document.body.innerHTML.replaceAll(/\s/g, "");
            modal.closeAll();
            await new Promise((value) => {setTimeout(value, common_timeout_for_dom)});
            return document.test_data;
        }

        beforeAll(
            async () => {
                old_modal = (await import("./old/modal.js"))["default"];
                new_modal = (await import("../../../js/modules/Modal.mjs"))["default"];
                new_modal();
            }
        );

        beforeEach(
            () => {
                document.body.innerHTML = "";
            }
        );

        test(
            "Single create and close cycle",
            async () => {
                const old_data = await create_and_close(old_modal);
                document.body.innerHTML = "";
                const new_data = await create_and_close(new_modal);
                
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );

        test(
            "Double create and close cycle",
            async () => {
                const old_data = await double_create_and_close(old_modal);
                document.body.innerHTML = "";
                const new_data = await double_create_and_close(new_modal);
                
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );

        test(
            "Close all modals",
            async () => {
                const old_data = await close_all(old_modal);
                document.body.innerHTML = "";
                const new_data = await close_all(new_modal);
                
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );

        test(
            "Modal's templates creation",
            async () => {
                const old_data = await modal_templates(old_modal);
                document.body.innerHTML = "";
                const new_data = await modal_templates(new_modal);
                
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );
    }
);