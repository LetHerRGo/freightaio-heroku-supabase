import jwt from "jsonwebtoken";
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Function to authenticate the user and assign a role
const authenticateUser = async (username, password) => {
    let user = null;
    let role = null;
// check which type of user is and asign role
    user = await knex('agent_user').where({username}).first();
    if (user) {
        role = 'agent';
    } else {
        user = await knex('client_user').where({username}).first();
        if (user) {
            role = 'client';
        } else {
            user = await knex('forwarder_operator').where({username}).first();
            if (user) {
                role = 'operator';
            }
        }
    }

    if (!user) {
        throw new Error ('User not found');
    }

    if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

    const token = jwt.sign ({
        id: user.id,
        username: user.username,
        role: role,
    }, 'your_jwt_secret', {expiresIn: '12h'});
    return token;
};

export default authenticateUser;