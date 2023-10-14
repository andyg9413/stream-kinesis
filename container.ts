import {asClass, asValue, asFunction, Lifetime, createContainer} from 'awilix';
import {UserLimitRepository} from "./db/user-limit.repository";
const container = createContainer();
const userLimitService = asClass(UserLimitRepository, { lifetime: Lifetime.SINGLETON });

container.register({
    userLimitService
});
export const inject = (someClass) => {
        let name = someClass

        if (typeof someClass !== 'string') {
            name = someClass.name.charAt(0).toLowerCase() + someClass.name.slice(1)
        }

        return container.resolve(name)
    }

export default container;