const input = document.querySelector('input[name="birthDate"]');
input.value = "1990-01-01";
input.dispatchEvent(new Event("input", { bubbles: true }));
input.dispatchEvent(new Event("change", { bubbles: true }));
JSON.stringify({ value: input.value, valid: input.checkValidity() });
