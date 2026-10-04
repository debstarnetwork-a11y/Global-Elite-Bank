import { snakeToCamel, camelToSnake } from './src/lib/casing';

const obj = { alert_threshold: 10000, admin_email: 'test@test.com' };
console.log(snakeToCamel(obj));

const obj2 = { alertThreshold: 10000, adminEmail: 'test@test.com' };
console.log(camelToSnake(obj2));
