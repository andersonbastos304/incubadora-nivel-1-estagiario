import {beforeAll, beforeEach, expect, jest, test} from "@jest/globals";

/**
 * @jest-environment jsdom
 */
describe(
    "Compatibility with old lib.",
    () => {
        let old_validator;
        let new_validator;

        let form_element;

        function create_form_element() {
            const return_element = document.createElement("form");
            return_element.setAttribute("id", "test-form");

            const input_element_1 = document.createElement("input");
            input_element_1.setAttribute("type", "email");
            input_element_1.setAttribute("name", "email");
            input_element_1.setAttribute("required", "");
            return_element.append(input_element_1);

            const input_element_2 = document.createElement("input");
            input_element_2.setAttribute("type", "text");
            input_element_2.setAttribute("name", "keepalive");
            input_element_2.setAttribute("minlength", "6");
            return_element.append(input_element_2);

            const submit_element = document.createElement("input");
            submit_element.setAttribute("type", "submit");
            submit_element.setAttribute("value", "Send");
            return_element.append(submit_element);

            return return_element;
        }

        function trigger_validation_errors(validation_definition) {
            document.test_data = {};
            const FormValidator = validation_definition;
            const validator = new FormValidator(form_element);
            for(const field of form_element.querySelectorAll("input")) {
                field.click();
                field.blur();
            }
            document.test_data.after_events = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        function submit_form(validation_definition) {
            document.test_data = {};
            const FormValidator = validation_definition;
            const validator = new FormValidator(form_element);
            validator.onSubmit = jest.fn((data) => {console.log(data)});     //This is needed for the sake of the old validator implementation
            const fields = form_element.querySelectorAll("input");
            fields[0].setAttribute("value", "a@b.c");
            fields[1].setAttribute("value", "123456");
            fields[2].click();
            document.test_data.after_submit = document.body.innerHTML.replaceAll(/\s/g, "");
            return document.test_data;
        }

        function reset_body() {
            document.body.innerHTML = "";
            form_element = create_form_element();
            document.body.append(form_element);
        }

        beforeAll(
            async () => {
                old_validator = (await import("./old/form-validator.js"))["default"];
                new_validator = (await import("../../../js/modules/Form_Validator.mjs"))["default"];
            }
        );

        beforeEach(
            () => {
                reset_body();
            }
        );

        test(
            "Field's validation",
            () => {
                const old_data = trigger_validation_errors(old_validator);
                reset_body();
                const new_data = trigger_validation_errors(new_validator);
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );

        test(
            "Form send",
            () => {
                const old_data = submit_form(old_validator);
                reset_body();
                const new_data = submit_form(new_validator);
                expect(new_data).not.toEqual({});
                expect(old_data).not.toEqual({});
                expect(new_data).toEqual(old_data);
            }
        );
    }
)