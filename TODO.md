# TODO: Add Phone Field to Registration

- [x] Update `src/components/lib/services/auth.service.ts`: Add phone parameter to register function and include it in the request body.
- [x] Update `src/components/register-form.tsx`: Add phone state variable, add phone input field (required), update handleSubmit to pass phone to register function.

# TODO: Add Edit Profile Feature

- [x] Add `updateCustomerProfile` function to `src/components/lib/services/auth.service.ts`.
- [x] Update `src/app/profile/page.tsx` to include edit functionality with form inputs for username, email, and phone.
