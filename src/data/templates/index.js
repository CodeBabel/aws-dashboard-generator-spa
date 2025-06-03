import s3 from './s3.json';
import lambda from './lambda.json';
import ec2 from './ec2.json';
import alb from './alb.json';

const templates = { s3, lambda, ec2, alb };

export function getTemplate(resourceType) {
    return templates[resourceType];
}

export function getAllTemplates() {
    return templates;
}

export function addTemplate(name, template) {
    if (!templates[name]) {
        templates[name] = template;
        return true;
    }
    return false;
}