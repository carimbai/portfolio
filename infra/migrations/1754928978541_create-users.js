const { unique } = require("next/dist/build/utils");

exports.up = (pgm) => {
    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        // For reference, GitHub limits usernames to 39 characters.
        username: {
            type: "varchar(30)",
            notNull: true,
            unique: true,
        },

        //For reference, why 254 in email length: https://stackoverflow.com/a/1199238
        email: {
            type: "varchar(254)",
            notNull: true,
            unique: true,
        },

        //For reference, why 72 in password: https://security.stackexchange.com/q/39849
        password: {
            type: "varchar(72)",
            notNull: true,
        },

        //For reference, why timestamptz: https://justatheory.com/2012/04/postgres-use-timestamptz/
        created_at: {
            type: "timestamptz",
            default: pgm.func("now()")
        },

        updated_at: {
            type: "timestamptz",
            default: pgm.func("now()")
        },
    });
};

exports.down = false;
