import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, ownerAc, adminAc, memberAc } from 'better-auth/plugins/organization/access'

// https://better-auth.com/docs/plugins/organization#custom-permissions

const statement = {
    ...defaultStatements,
    project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);


const owner = ac.newRole({ 
    project: ["create", "update", "delete"], 
    ...ownerAc.statements,
}); 

const admin = ac.newRole({ 
    project: ["create", "update"], 
    ...adminAc.statements,
}); 

const member = ac.newRole({ 
    project: [], 
    ...memberAc.statements,
}); 

export {
    ac,
    owner,
    admin,
    member,
};