import reactNumberField from "../fields/mobile-number/config";
import { admins } from '../access/admins';
import { adminsAndUser } from '../access/adminsAndUser';
import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {

    slug: 'users',

    // any collection can have auth enabled, and may have more than one
    // by enabling auth, the API adds more routes for api/users like /login, /forgot-password, and more
    // here we configure auth settings in an object, instead use "auth: true" to accept all defaults
    auth: {
        forgotPassword: {
            generateEmailHTML: ({ token, user }) => {
                // Use the token provided to allow your user to reset their password
                // We will send them to the frontend NextJS app instead of sending
                // them to the Payload admin by default
                const resetPasswordURL = `${process.env.PAYLOAD_PUBLIC_NEXT_URL}/reset-password?token=${token}`;

                return `
              <!doctype html>
              <html>
                <body>
                  <h1>Hi there</h1>
                  <p>Click below to reset your password.</p>
                  <p>
                    <a href="${resetPasswordURL}">${resetPasswordURL}</a>
                  </p>
                </body>
              </html>
            `;
            }
        },
    },
    admin: {
        useAsTitle: 'email',
        group: 'Admin',
    },
    access: {
        // Anyone can create a user
        create: () => true,

        // Users with role 'admin' can read and update all users
        // But users with role 'customer' can only read and update their own
        read: adminsAndUser,
        update: adminsAndUser,

        // Only admins can delete
        delete: admins,
    },
    // auth enabled collections get email and other fields for secure authentication in addition to the fields you add
    fields: [
        {
            name: 'name',
            type: 'text',
            // saveToJWT tells Payload to include the field data to the JSON web token used to authenticate users
            saveToJWT: true,
        },
        reactNumberField,
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            access: {
                // Only allow admins to update the roles of a user
                update: admins,
            },
            // Default role is 'customer'
            defaultValue: ['customer'],
            options: ['admin', 'customer', 'user', 'player', 'group'],
        },
    ],
};

export default Users;
